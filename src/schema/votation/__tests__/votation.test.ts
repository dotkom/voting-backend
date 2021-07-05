import { createTestContext } from '../../../lib/tests/testContext';
import { gql } from 'graphql-request';
import { VotationStatus, MeetingStatus, MajorityType, Role } from '.prisma/client';
import { uuid } from 'casual';
import { Votation } from '../typedefs';
import casual from 'casual';
const ctx = createTestContext();

interface StaticMeetingDataType {
    organization: string;
    title: string;
    startTime: string;
    description: string;
    status: MeetingStatus;
}

interface StaticVotationDataType {
    title: string;
    description: string;
    blankVotes: boolean;
    hiddenVotes: boolean;
    severalVotes: boolean;
    majorityType: MajorityType;
    majorityThreshold: number;
}

const staticMeetingData: StaticMeetingDataType = {
    organization: 'organization',
    title: 'test title',
    startTime: '2021-04-13T11:29:58.000Z',
    description: 'test description',
    status: MeetingStatus.UPCOMING,
};

const staticVotationData: StaticVotationDataType = {
    title: 'test votation title',
    description: 'test votation description',
    blankVotes: true,
    hiddenVotes: true,
    severalVotes: true,
    majorityType: MajorityType.SIMPLE,
    majorityThreshold: 50,
};

const updatedStaticVotationData: StaticVotationDataType = {
    title: 'updated votation title',
    description: 'updated votation description',
    blankVotes: false,
    hiddenVotes: false,
    severalVotes: false,
    majorityType: MajorityType.QUALIFIED,
    majorityThreshold: 67,
};

const alternative1Text = 'alternative1 text';

const alternative2Text = 'alternative2 text';

const createMeeting = async (ownerId: string, role: Role, isVotingEligible: boolean) => {
    return await ctx.prisma.meeting.create({
        data: {
            ...staticMeetingData,
            ownerId: ownerId,
            participants: {
                create: {
                    userId: ownerId,
                    role: role,
                    isVotingEligible: isVotingEligible,
                },
            },
        },
    });
};

const createVotation = async (meetingId: string, status: VotationStatus, index: number) => {
    return await ctx.prisma.votation.create({
        data: {
            ...staticVotationData,
            status: status,
            index,
            meetingId,
        },
    });
};

const createAlternative = async (votationId: string, text: string) => {
    return ctx.prisma.alternative.create({
        data: {
            text,
            votationId,
        },
    });
};

const formatVotationToCompare = (votation: any) => {
    return {
        title: votation.title,
        description: votation.description,
        blankVotes: votation.blankVotes,
        hiddenVotes: votation.hiddenVotes,
        severalVotes: votation.severalVotes,
        majorityType: votation.majorityType,
        majorityThreshold: votation.majorityThreshold,
        index: votation.index,
    };
};

it('should return votation by id', async () => {
    const meeting = await createMeeting(ctx.userId, Role.COUNTER, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const votationId = votation.id;
    const getVotation = await ctx.client.request(
        gql`
            query GetVotationById($votationId: String!) {
                votationById(votationId: $votationId) {
                    id
                    title
                    description
                    blankVotes
                    hiddenVotes
                    severalVotes
                    majorityType
                    majorityThreshold
                    meetingId
                }
            }
        `,
        {
            votationId,
        }
    );
    expect(getVotation.votationById).toEqual({
        id: votationId,
        ...staticVotationData,
        meetingId: meeting.id,
    });
});

it('should throw error from votation by id', async () => {
    const meeting = await createMeeting(ctx.userId, Role.COUNTER, true);
    await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    try {
        await ctx.client.request(
            gql`
                query GetVotationById($votationId: String!) {
                    votationById(votationId: $votationId) {
                        id
                        title
                        description
                        blankVotes
                        majorityType
                        majorityThreshold
                        meetingId
                    }
                }
            `,
            {
                votationId: '1',
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should return number of voting eligible participants by votation id', async () => {
    const meeting = await createMeeting(ctx.userId, Role.PARTICIPANT, true);
    const user1 = await ctx.prisma.user.create({
        data: {
            password: casual.password,
            email: casual.email,
        },
    });
    const user2 = await ctx.prisma.user.create({
        data: {
            password: casual.password,
            email: casual.email,
        },
    });
    await ctx.prisma.participant.create({
        data: {
            userId: user1.id,
            meetingId: meeting.id,
            isVotingEligible: false,
            role: Role.PARTICIPANT,
        },
    });
    await ctx.prisma.participant.create({
        data: {
            userId: user2.id,
            meetingId: meeting.id,
            isVotingEligible: true,
            role: Role.PARTICIPANT,
        },
    });
    const votation = await createVotation(meeting.id, VotationStatus.OPEN, 1);
    const votingEligibleCount = await ctx.client.request(
        gql`
            query VotingEligibleCount($votationId: String!) {
                votingEligibleCount(votationId: $votationId)
            }
        `,
        {
            votationId: votation.id,
        }
    );
    expect(votingEligibleCount.votingEligibleCount).toBe(2);
});

it('should return not authorised trying to access votingEligibleCount', async () => {
    const user = await ctx.prisma.user.create({
        data: {
            email: casual.email,
            password: casual.password,
        },
    });
    const meeting = await createMeeting(user.id, Role.PARTICIPANT, true);
    const votation = await createVotation(meeting.id, VotationStatus.OPEN, 1);
    try {
        await ctx.client.request(
            gql`
                query VotingEligibleCount($votationId: String!) {
                    votingEligibleCount(votationId: $votationId)
                }
            `,
            {
                votationId: votation.id,
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should return alternatives by votation successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.COUNTER, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const alternative1 = await createAlternative(votation.id, alternative1Text);
    const alternative2 = await createAlternative(votation.id, alternative2Text);
    const votationId = votation.id;
    const getAlternatives = await ctx.client.request(
        gql`
            query AlternativesByVotation($votationId: String!) {
                alternativesByVotation(votationId: $votationId) {
                    id
                    text
                    votationId
                }
            }
        `,
        {
            votationId,
        }
    );
    expect(getAlternatives.alternativesByVotation).toHaveLength(2);
    expect(getAlternatives.alternativesByVotation).toContainEqual(alternative1);
    expect(getAlternatives.alternativesByVotation).toContainEqual(alternative2);
});

it('should return not authorized', async () => {
    const otherUser = await ctx.prisma.user.create({
        data: {
            email: 'test@example.com',
            password: 'hash',
        },
    });
    const meeting = await createMeeting(otherUser.id, Role.COUNTER, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    await createAlternative(votation.id, alternative1Text);
    await createAlternative(votation.id, alternative2Text);
    try {
        await ctx.client.request(
            gql`
                query AlternativesByVotation($votationId: String!) {
                    alternativesByVotation(votationId: $votationId) {
                        id
                        text
                        votationId
                    }
                }
            `,
            {
                votationId: votation.id,
            }
        );
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should create votations successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, true);
    const variables = {
        meetingId: meeting.id,
        votations: [
            {
                ...staticVotationData,
                index: 1,
                alternatives: ['alternative1', 'alternative2'],
            },
            {
                ...staticVotationData,
                index: 2,
                alternatives: [],
            },
        ],
    };
    const createVotations = await ctx.client.request(
        gql`
            mutation CreateVotations($meetingId: String!, $votations: [CreateVotationInput!]!) {
                createVotations(meetingId: $meetingId, votations: $votations) {
                    id
                    title
                    description
                    index
                    blankVotes
                    hiddenVotes
                    severalVotes
                    majorityType
                    majorityThreshold
                    alternatives {
                        text
                    }
                }
            }
        `,
        variables
    );
    const alternativesCountFirstVotation = await ctx.prisma.alternative.count({
        where: {
            votationId: createVotations.createVotations[0].id,
        },
    });
    const alternativesCountSecondVotation = await ctx.prisma.alternative.count({
        where: {
            votationId: createVotations.createVotations[1].id,
        },
    });
    expect(
        createVotations.createVotations.map((votation: any) => {
            return {
                ...votation,
                id: '',
                alternatives: [],
            };
        })
    ).toEqual(
        variables.votations.map((votation) => {
            return {
                ...votation,
                id: '',
                alternatives: [],
            };
        })
    );
    expect(createVotations.createVotations.length).toEqual(2);
    expect(alternativesCountFirstVotation).toEqual(2);
    expect(alternativesCountSecondVotation).toEqual(0);
});

it('should update votations successfully', async () => {
    const alternative1UpdatedText = 'alternative1Updated';
    const alternative2UpdatedText = 'alternative2Updated';
    const alternative3UpdatedText = 'alternative3Updated';
    const alternative4UpdatedText = 'alternative4Updated';
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, true);
    const votation1 = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const alternative1 = await createAlternative(votation1.id, 'alternative1');
    const alternative2 = await createAlternative(votation1.id, 'alternative2');
    const votation2 = await createVotation(meeting.id, VotationStatus.UPCOMING, 2);
    const alternative3 = await createAlternative(votation2.id, 'alternative3');
    const alternative4 = await createAlternative(votation2.id, 'alternative4');
    const variables = {
        votations: [
            {
                id: votation1.id,
                ...updatedStaticVotationData,
                index: 2,
                alternatives: [
                    {
                        id: alternative1.id,
                        text: alternative1UpdatedText,
                    },
                    {
                        id: alternative2.id,
                        text: alternative2UpdatedText,
                    },
                ],
            },
            {
                id: votation2.id,
                ...updatedStaticVotationData,
                index: 3,
                alternatives: [
                    {
                        id: alternative3.id,
                        text: alternative3UpdatedText,
                    },
                    {
                        id: alternative4.id,
                        text: alternative4UpdatedText,
                    },
                    {
                        id: uuid,
                        text: 'alternative5',
                    },
                ],
            },
        ],
    };
    await ctx.client.request(
        gql`
            mutation UpdateVotations($votations: [UpdateVotationInput!]!) {
                updateVotations(votations: $votations) {
                    id
                    title
                    description
                    blankVotes
                    hiddenVotes
                    severalVotes
                    majorityType
                    majorityThreshold
                    index
                    status
                    alternatives {
                        text
                    }
                }
            }
        `,
        variables
    );
    const votation1Updated = await ctx.prisma.votation.findUnique({
        where: {
            id: votation1.id,
        },
    });
    const alternative1Updated = await ctx.prisma.alternative.findUnique({
        where: {
            id: alternative1.id,
        },
    });
    const votation2Updated = await ctx.prisma.votation.findUnique({
        where: {
            id: votation2.id,
        },
    });
    const alternativeToVotation2Count = await ctx.prisma.alternative.count({
        where: {
            votationId: votation2.id,
        },
    });
    if (!votation1Updated || !votation2Updated || !alternative1Updated || !alternativeToVotation2Count) {
        expect(false).toBeTruthy();
    } else {
        expect(formatVotationToCompare(votation1Updated)).toEqual(formatVotationToCompare(variables.votations[0]));
        expect(formatVotationToCompare(votation2Updated)).toEqual(formatVotationToCompare(variables.votations[1]));
        expect(alternative1Updated?.text).toEqual(alternative1UpdatedText);
        expect(alternativeToVotation2Count).toEqual(3);
    }
});

it('should not update votations successfully', async () => {
    const alternative1UpdatedText = 'alternative1Updated';
    const alternative2UpdatedText = 'alternative2Updated';
    const alternative3UpdatedText = 'alternative3Updated';
    const alternative4UpdatedText = 'alternative4Updated';
    const meeting = await createMeeting(ctx.userId, Role.COUNTER, true);
    const votation1 = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const alternative1 = await createAlternative(votation1.id, 'alternative1');
    const alternative2 = await createAlternative(votation1.id, 'alternative2');
    const votation2 = await createVotation(meeting.id, VotationStatus.UPCOMING, 2);
    const alternative3 = await createAlternative(votation1.id, 'alternative3');
    const alternative4 = await createAlternative(votation1.id, 'alternative4');
    const variables = {
        votations: [
            {
                id: votation1.id,
                ...updatedStaticVotationData,
                index: 2,
                alternatives: [
                    {
                        id: alternative1.id,
                        text: alternative1UpdatedText,
                    },
                    {
                        id: alternative2.id,
                        text: alternative2UpdatedText,
                    },
                ],
            },
            {
                id: votation2.id,
                ...updatedStaticVotationData,
                index: 3,
                alternatives: [
                    {
                        id: alternative3.id,
                        text: alternative3UpdatedText,
                    },
                    {
                        id: alternative4.id,
                        text: alternative4UpdatedText,
                    },
                    {
                        id: uuid,
                        text: 'alternative5',
                    },
                ],
            },
        ],
    };
    try {
        await ctx.client.request(
            gql`
                mutation UpdateVotations($votations: [UpdateVotationInput!]!) {
                    updateVotations(votations: $votations) {
                        id
                        title
                        description
                        blankVotes
                        hiddenVotes
                        severalVotes
                        majorityType
                        majorityThreshold
                        index
                    }
                }
            `,
            variables
        );
        expect(false).toBeTruthy();
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should update votation status successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const newStatus = VotationStatus.OPEN;
    const updateVotationStatus = await ctx.client.request(
        gql`
            mutation UpdateVotationStatus($id: String!, $status: VotationStatus!) {
                updateVotationStatus(id: $id, status: $status) {
                    __typename
                    ... on Votation {
                        id
                        status
                    }
                    ... on MaxOneOpenVotationError {
                        message
                    }
                }
            }
        `,
        {
            id: votation.id,
            status: newStatus,
        }
    );
    expect(updateVotationStatus.updateVotationStatus.__typename).toBe('Votation');
    expect(updateVotationStatus.updateVotationStatus.status).toBe(newStatus);
});

it('should return MaxOneOpenVotationStatus trying to open votation', async () => {
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, true);
    await createVotation(meeting.id, VotationStatus.OPEN, 1);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 2);
    const updateVotationStatus = await ctx.client.request(
        gql`
            mutation UpdateVotationStatus($id: String!, $status: VotationStatus!) {
                updateVotationStatus(id: $id, status: $status) {
                    __typename
                    ... on Votation {
                        id
                        status
                    }
                    ... on MaxOneOpenVotationError {
                        message
                    }
                }
            }
        `,
        {
            id: votation.id,
            status: VotationStatus.OPEN,
        }
    );
    expect(updateVotationStatus.updateVotationStatus.__typename).toBe('MaxOneOpenVotationError');
});

it('should return Not Authorised trying to update votation status', async () => {
    const meeting = await createMeeting(ctx.userId, Role.COUNTER, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const newStatus = VotationStatus.OPEN;
    try {
        await ctx.client.request(
            gql`
                mutation UpdateVotationStatus($id: String!, $status: VotationStatus!) {
                    updateVotationStatus(id: $id, status: $status) {
                        __typename
                        ... on Votation {
                            id
                            status
                        }
                        ... on MaxOneOpenVotationError {
                            message
                        }
                    }
                }
            `,
            {
                id: votation.id,
                status: newStatus,
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should not create votations successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.COUNTER, true);
    const variables = {
        meetingId: meeting.id,
        votations: [
            {
                ...staticVotationData,
                index: 1,
                alternatives: [],
            },
            {
                ...staticVotationData,
                index: 2,
                alternatives: [],
            },
        ],
    };
    try {
        await ctx.client.request(
            gql`
                mutation CreateVotations($meetingId: String!, $votations: [CreateVotationInput!]!) {
                    createVotations(meetingId: $meetingId, votations: $votations) {
                        id
                        title
                        description
                        index
                        blankVotes
                        hiddenVotes
                        severalVotes
                        majorityType
                        majorityThreshold
                        alternatives {
                            text
                        }
                    }
                }
            `,
            variables
        );
        expect(false).toBeTruthy();
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should create alterative successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const variables = {
        text: alternative1Text,
        votationId: votation.id,
    };
    const createAlternative = await ctx.client.request(
        gql`
            mutation CreateAlternative($text: String!, $votationId: String!) {
                createAlternative(text: $text, votationId: $votationId) {
                    text
                    votationId
                }
            }
        `,
        variables
    );
    expect(createAlternative.createAlternative).toEqual(variables);
});

it('should not create alternative successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.COUNTER, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const variables = {
        text: alternative1Text,
        votationId: votation.id,
    };
    expect(
        async () =>
            await ctx.client.request(
                gql`
                    mutation CreateAlternative($text: String!, $votationId: String!) {
                        createAlternative(text: $text, votationId: $votationId) {
                            text
                            votationId
                        }
                    }
                `,
                variables
            )
    ).rejects.toThrow();
});

it('should delete alternative successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, true);
    const votation = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const alternative1 = await createAlternative(votation.id, alternative1Text);
    const alternative2 = await createAlternative(votation.id, alternative2Text);
    await ctx.client.request(
        gql`
            mutation DeleteAlternatives($ids: [String!]!) {
                deleteAlternatives(ids: $ids)
            }
        `,
        {
            ids: [alternative1.id],
        }
    );
    const numberOfAlternativesWithId1 = await ctx.prisma.alternative.count({ where: { id: alternative1.id } });
    const numberOfAlternativesWithId2 = await ctx.prisma.alternative.count({ where: { id: alternative2.id } });
    expect(numberOfAlternativesWithId1).toBe(0);
    expect(numberOfAlternativesWithId2).toBe(1);
});

it('should delete votation successfully', async () => {
    const meetingOwnerId = ctx.userId;
    const meeting = await ctx.prisma.meeting.create({
        data: {
            ...staticMeetingData,
            ownerId: meetingOwnerId,
            participants: {
                create: {
                    userId: ctx.userId,
                    role: Role.ADMIN,
                    isVotingEligible: true,
                },
            },
        },
    });
    const votation1 = await createVotation(meeting.id, VotationStatus.UPCOMING, 1);
    const votation2 = await createVotation(meeting.id, VotationStatus.UPCOMING, 2);
    await createAlternative(votation1.id, 'alternative');
    await ctx.client.request(
        gql`
            mutation DeleteVotations($ids: [String!]!) {
                deleteVotations(ids: $ids)
            }
        `,
        {
            ids: [votation1.id],
        }
    );
    const numberOfVotationsWithId1 = await ctx.prisma.votation.count({ where: { id: votation1.id } });
    const numberOfVotationsWithId2 = await ctx.prisma.votation.count({ where: { id: votation2.id } });
    expect(numberOfVotationsWithId1).toBe(0);
    expect(numberOfVotationsWithId2).toBe(1);
});

it('should not delete alternative successfully', async () => {
    const meeting1 = await createMeeting(ctx.userId, Role.COUNTER, true);
    const meeting2 = await createMeeting(ctx.userId, Role.ADMIN, true);
    const votation1 = await createVotation(meeting1.id, VotationStatus.UPCOMING, 1);
    const votation2 = await createVotation(meeting2.id, VotationStatus.UPCOMING, 1);
    await createAlternative(votation1.id, alternative1Text);
    try {
        await ctx.client.request(
            gql`
                mutation DeleteAlternatives($ids: [String!]!) {
                    deleteAlternatives(ids: $ids)
                }
            `,
            {
                ids: [votation1.id, votation2.id],
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should not delete votation successfully', async () => {
    const meeting1 = await createMeeting(ctx.userId, Role.COUNTER, true);
    const meeting2 = await createMeeting(ctx.userId, Role.ADMIN, true);
    const votation1 = await createVotation(meeting1.id, VotationStatus.UPCOMING, 1);
    const votation2 = await createVotation(meeting2.id, VotationStatus.UPCOMING, 1);
    await createAlternative(votation1.id, alternative1Text);
    try {
        await ctx.client.request(
            gql`
                mutation DeleteVotations($ids: [String!]!) {
                    deleteVotations(ids: $ids)
                }
            `,
            {
                ids: [votation1.id, votation2.id],
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        expect(error.message).toContain('Not Authorised!');
    }
});

it('should cast vote successfully', async () => {
    const meeting = await createMeeting(ctx.userId, Role.PARTICIPANT, true);
    const votation = await createVotation(meeting.id, VotationStatus.OPEN, 1);
    const alternative = await createAlternative(votation.id, alternative1Text);
    await ctx.client.request(
        gql`
            mutation CastVote($alternativeId: String!) {
                castVote(alternativeId: $alternativeId) {
                    alternative {
                        id
                        text
                    }
                }
            }
        `,
        {
            alternativeId: alternative.id,
        }
    );
    const hasVoted = await ctx.prisma.hasVoted.count({
        where: {
            userId: ctx.userId,
            votationId: votation.id,
        },
    });
    expect(hasVoted).toBe(1);
});

it('should not cast vote successfully since votation is not ongoing', async () => {
    const meeting = await createMeeting(ctx.userId, Role.PARTICIPANT, true);
    const votation = await createVotation(meeting.id, VotationStatus.CHECKING_RESULT, 1);
    const alternative = await createAlternative(votation.id, alternative1Text);
    try {
        await ctx.client.request(
            gql`
                mutation CastVote($alternativeId: String!) {
                    castVote(alternativeId: $alternativeId) {
                        alternative {
                            id
                            text
                        }
                    }
                }
            `,
            {
                alternativeId: alternative.id,
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        // TODO: Check for correct error message
        const hasVoted = await ctx.prisma.hasVoted.count({
            where: {
                userId: ctx.userId,
                votationId: votation.id,
            },
        });
        expect(hasVoted).toBe(0);
    }
});

it('should not cast vote successfully since user is not participant', async () => {
    const meetingOwner = await ctx.prisma.user.create({
        data: {
            email: 'e@mail.com',
            password: 'password',
        },
    });
    const meeting = await createMeeting(meetingOwner.id, Role.ADMIN, true);
    const votation = await createVotation(meeting.id, VotationStatus.OPEN, 1);
    const alternative = await createAlternative(votation.id, alternative1Text);
    try {
        await ctx.client.request(
            gql`
                mutation CastVote($alternativeId: String!) {
                    castVote(alternativeId: $alternativeId) {
                        alternative {
                            id
                            text
                        }
                    }
                }
            `,
            {
                alternativeId: alternative.id,
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        // TODO: Check for correct error message
        const hasVoted = await ctx.prisma.hasVoted.count({
            where: {
                userId: ctx.userId,
                votationId: votation.id,
            },
        });
        expect(hasVoted).toBe(0);
    }
});

it('should not cast vote successfully since user has already voted', async () => {
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, true);
    const votation = await createVotation(meeting.id, VotationStatus.OPEN, 1);
    const alternative = await createAlternative(votation.id, alternative1Text);
    await ctx.prisma.hasVoted.create({
        data: {
            votationId: votation.id,
            userId: ctx.userId,
        },
    });
    try {
        await ctx.client.request(
            gql`
                mutation CastVote($alternativeId: String!) {
                    castVote(alternativeId: $alternativeId) {
                        alternative {
                            id
                            text
                        }
                    }
                }
            `,
            {
                alternativeId: alternative.id,
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        // TODO: Check for correct error message
        const hasVoted = await ctx.prisma.hasVoted.count({
            where: {
                userId: ctx.userId,
                votationId: votation.id,
            },
        });
        expect(hasVoted).toBe(1);
    }
});

it('should not cast vote successfully since the participant is not votingEligible', async () => {
    const meeting = await createMeeting(ctx.userId, Role.ADMIN, false);
    const votation = await createVotation(meeting.id, VotationStatus.OPEN, 1);
    const alternative = await createAlternative(votation.id, alternative1Text);
    await ctx.prisma.hasVoted.create({
        data: {
            votationId: votation.id,
            userId: ctx.userId,
        },
    });
    try {
        await ctx.client.request(
            gql`
                mutation CastVote($alternativeId: String!) {
                    castVote(alternativeId: $alternativeId) {
                        alternative {
                            id
                            text
                        }
                    }
                }
            `,
            {
                alternativeId: alternative.id,
            }
        );
        expect(false).toBeTruthy();
    } catch (error) {
        // TODO: Check for correct error message
        const hasVoted = await ctx.prisma.hasVoted.count({
            where: {
                userId: ctx.userId,
                votationId: votation.id,
            },
        });
        expect(hasVoted).toBe(1);
    }
});
