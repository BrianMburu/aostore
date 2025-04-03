import { PROCESS_ID_DEV_FORUM_TABLE } from '@/config/ao';
import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { ForumPost } from '@/types/forum';
import { Rank } from '@/types/rank';
import { Reply } from '@/types/reply';
import { Tip } from '@/types/tip';
import { User } from '@/types/user';
import { HelpfulData } from '@/types/voter';
import { cleanAoJson, fetchAOmessages } from '@/utils/ao';
export interface ForumFilterParams {
    topic?: string;
    search?: string;
    page?: string;
}

export const ForumService = {
    async fetchForumPosts(appId: string, params: ForumFilterParams, useInfiniteScroll: boolean = false): Promise<{ posts: ForumPost[], total: number }> {
        let forumPosts: ForumPost[] = [];
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchDevForumData" },
                { name: "appId", value: appId }

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                forumPosts = Object.values(messageData.data);
                // console.log("Forum Posts Data: => ", forumPosts)
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Forum Posts, ${error}`)
        }

        // Filter the dummy Posts based on the parameters
        const filtered = forumPosts.filter(post => {
            const matchesTopic = !params.topic || params.topic === 'all' || post.topic === params.topic;
            const matchesSearch = !params.search || post.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesTopic && matchesSearch;
        });

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort and slice the data for the current page
        const sortedData = filtered
            .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())

        const posts = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return {
            posts,
            total: filtered.length
        }
    },

    async fetchPost(appId: string, postId: string): Promise<ForumPost> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchDevForumPost" },
                { name: "appId", value: appId },
                { name: "devForumId", value: postId }

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const forumPost = messageData.data;
                // console.log("Forum Posts Data: => ", forumPost)
                return forumPost
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get Forum Posts, ${error}`)
        }
    },

    async createForumPost(appId: string, user: User, rank: Rank,
        postData: { title: string, topic: string, description: string }): Promise<ForumPost> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AskDevForum" },
                { name: "appId", value: appId },
                { name: "topic", value: postData.topic },
                { name: "description", value: postData.description },
                { name: "title", value: postData.title },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const forumQuestion: ForumPost = messageData.data;
                return forumQuestion;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to submit Question, ${error}`)
        }
    },

    async editForumPost(appId: string, postId: string, rank: Rank, postData: { title: string, topic: string, description: string }): Promise<ForumPost> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditDevForumRequest" },
                { name: "appId", value: appId },
                { name: "devForumId", value: postId },
                { name: "topic", value: postData.topic },
                { name: "description", value: postData.description },
                { name: "title", value: postData.title },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const forumQuestion: ForumPost = messageData.data;
                return forumQuestion;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to submit Question, ${error}`)
        }
    },

    async submitReply(appId: string, postId: string, user: User, rank: Rank, replyData: { description: string }): Promise<Reply> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddDevForumReply" },
                { name: "appId", value: appId },
                { name: "devForumId", value: postId },
                { name: "description", value: replyData.description },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Forum Reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to send reply, ${error}`)
        }
    },

    async editReply(appId: string, postId: string, replyId: string, user: User, rank: Rank, replyData: { description: string }): Promise<Reply> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "EditDevForumReply" },
                { name: "appId", value: appId },
                { name: "devForumId", value: postId },
                { name: "replyId", value: replyId },
                { name: "description", value: replyData.description },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Forum Reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: Reply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to send reply, ${error}`)
        }
    },

    async helpfulVote(appId: string, postId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkHelpfulDevForumPost" },
                { name: "appId", value: appId },
                { name: "devForumId", value: postId },

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("FOrum helpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const helpfulData: HelpfulData = messageData.data;
                return helpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote FOrum as helpful, ${error}`)
        }
    },

    async unhelpfulVote(appId: string, postId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "MarkUnhelpfulDevForumPost" },
                { name: "appId", value: appId },
                { name: "devForumId", value: postId },

            ], PROCESS_ID_DEV_FORUM_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Forum helpful Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const helpfulData: HelpfulData = messageData.data;
                return helpfulData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to vote Forum as helpful, ${error}`)
        }
    },

    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },
}