local json = require("json")


-- This process details
PROCESS_NAME = "aos Reviews_Table"
PROCESS_ID = "-E8bZaG3KJMNqwCCcIqFKTVzqNZgXxqX9Q32I_M3-Wo"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostore_main"
PROCESS_ID_MAIN = "QT_bqv-thVbp_uPFuotxpDu1FDpppXDs1aEre23HX_c"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
reviewsTable = reviewsTable or {}
aosPoints = aosPoints or {}
transactions = transactions or {}

-- counters variables
ReviewCounter = ReviewCounter or 0
ReplyCounter = ReplyCounter or 0
transactionCounter  = transactionCounter or 0



-- Function to get the current time in milliseconds
function getCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end

-- Function to generate a unique review ID
function generateReviewId()
    ReviewCounter = ReviewCounter + 1
    return "TX" .. tostring(ReviewCounter)
end

-- Function to generate a unique transaction ID
function generateTransactionId()
    transactionCounter = transactionCounter + 1
    return "TX" .. tostring(transactionCounter)
end

-- Function to generate a unique transaction ID
function generateReplyId()
    ReplyCounter = ReplyCounter + 1
    return "TX" .. tostring(ReplyCounter)
end

function extractNumberFromKey(key)
    local num = tonumber(key:match("%d+"))
    return num or 0
end


Handlers.add(
    "AddReviewTableX",
    Handlers.utils.hasMatchingTag("Action", "AddReviewTableX"),
    function(m)
        local currentTime = getCurrentTime(m)
        local ReviewId = generateReviewId()
        local replyId = generateReplyId()
        local AppId = m.Tags.appId
        local user  = m.Tags.user
        local profileUrl = m.Tags.profileUrl
        local username = m.Tags.username
        local caller = m.From
        
        print("Here is the caller Process ID"..caller)
        
        -- Check if PROCESS_ID called this handler
        if ARS ~= caller then
            ao.send({ Target = m.From, Data = "Only the main processID can call this handler" })
            return
        end

        if user == nil then
            ao.send({ Target = m.From, Data = "user is missing or empty." })
            return
        end
        
        if AppId == nil then
            ao.send({ Target = m.From, Data = "appId is missing or empty." })
            return
        end
        
        if profileUrl == nil then
            ao.send({ Target = m.From, Data = "profileUrl is missing or empty." })
            return
        end
        
        if username == nil then
            ao.send({ Target = m.From, Data = "username is missing or empty." })
            return
        end
        -- Ensure global tables are initialized
        reviewsTable = reviewsTable or {}
        aosPoints = aosPoints or {}

        -- Create the review table for this AppId
        reviewsTable[AppId] = {
            appId = AppId,
            status = false,
            Owner = user,
            mods = { [user] = { permissions = { replyReview = true }, time = currentTime } },
            reviews = {
                [ReviewId] = {
                    reviewId = ReviewId,
                    user = user,
                    username = username,
                    comment = "Great app!",
                    profileUrl = profileUrl,
                    edited = false,
                    Rank = "Architect",
                    rating = 5,
                    timestamp = currentTime,
                    voters = {
                        foundHelpful = { 
                            count = 1,
                            countHistory = { { time = currentTime, count = 1 } },
                            users = { [user] = {voted = true, time = currentTime } }
                        },
                        foundUnhelpful = { 
                            count = 0,
                            countHistory = { { time = currentTime, count = 0 } },
                            users = { [user] = {voted = false, time = currentTime } }
                        }
                    },
                    replies = {
                        [replyId] = {
                            replyId = replyId,
                            user = user,
                            username = username,
                            comment = "Thank you for your feedback!",
                            timestamp = currentTime,
                            edited = false,
                            Rank = "Architect",
                            voters = {
                                foundHelpful = { 
                            count = 1,
                            countHistory = { { time = currentTime, count = 1 } },
                            users = { [user] = {voted = true, time = currentTime } }
},
                                foundUnhelpful = { 
                            count = 0,
                            countHistory = { { time = currentTime, count = 0 } },
                            users = { [user] = {voted = false, time = currentTime } }
                        }
                    },
                        }
                    }
                }
            },
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = { [user] = { reviewed = true, time = currentTime } }
        }

        -- Create the aosPoints table for this AppId
        aosPoints[AppId] = {
            appId = AppId,
            status = false,
            TotalpointsApp = 5,
            Ranks = {
                Architect = { TotalPoints = 5, time = currentTime, count = 1 },
                Oracle =  { TotalPoints = 0, time = currentTime, count = 0 },
                Agent =  { TotalPoints = 0, time = currentTime, count = 0 },
                Operator = { TotalPoints = 0, time = currentTime, count = 0 },
                Redpill = { TotalPoints = 0, time = currentTime, count = 0 },
            },
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { time = currentTime , points = 5 }
            }
        }
        
        reviewsTable[#reviewsTable + 1] = {
            reviewsTable[AppId]
        }

        aosPoints[#aosPoints + 1] = {
            aosPoints[AppId]
        }

        local transactionId = generateTransactionId()
        local currentPoints = aosPoints[AppId].users[user].points
    
        transactions[#transactions + 1] = {
            user = user,
            transactionid = transactionId,
            type = "Project Creation",
            points = currentPoints,
            timestamp = currentTime}
        -- Update statuses to true after creation
        reviewsTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "ReviewsRespons",
            Data = tostring(status)
        })
        print("Successfully Added Review table")
    end
)



Handlers.add(
    "FetchAppReviews",
    Handlers.utils.hasMatchingTag("Action", "FetchAppReviews"),
    function(m)
        local appId = m.Tags.AppId

        -- Validate input
        if not appId then
            ao.send({ Target = m.From, Data = "AppId is missing." })
            return
        end

        -- Check if the app exists in the reviews table
        if not reviewsTable[appId] then
            ao.send({ Target = m.From, Data = "No reviews found for this app." })
            return
        end

        -- Fetch the reviews
        local appReviews = reviewsTable[appId].reviews

        -- Check if there are reviews
        if not appReviews or #appReviews == 0 then
            ao.send({ Target = m.From, Data = "No reviews available for this app." })
            return
        end

        -- Convert reviews to JSON for sending
        local reviewsJson = tableToJson(appReviews)

        -- Send the reviews back to the user
        ao.send({
            Target = m.From,
            Data = reviewsJson
        })
    end
)


Handlers.add(
    "AddReviewAppN",
    Handlers.utils.hasMatchingTag("Action", "AddReviewAppN"),
    function(m)

        -- Check if all required m.Tags are present
        local requiredTags = { "username", "profileUrl", "AppId", "comment", "rating" }
        for _, tag in ipairs(requiredTags) do
            if m.Tags[tag] == nil then
                print("Error: " .. tag .. " is nil.")
                ao.send({ Target = m.From, Data = tag .. " is missing or empty." })
                return
            end
        end

        local appId = m.Tags.AppId
        local comment = m.Tags.comment
        local user = m.From
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local rating = tonumber(m.Tags.rating)
        local currentTime = getCurrentTime(m)

        -- Validate rating
        if not rating or rating < 1 or rating > 5 then
            ao.send({ Target = m.From, Data = "Invalid rating. Please provide a rating between 1 and 5." })
            return
        end

        -- Initialize reviewsTable[appId] if not exists
        reviewsTable[appId] = reviewsTable[appId] or {
            count = 0,
            users = {},
            countHistory = {},
            reviews = {}
        }

        -- Initialize ratingsTable[appId] if not exists
        ratingsTable[appId] = ratingsTable[appId] or {
            count = 0,
            Totalratings = 0,
            users = {},
            countHistory = {}
        }

        local reviews = reviewsTable[appId]
        local ratings = ratingsTable[appId]

        -- Prevent duplicate ratings
        if reviews.users[user] then
            local points = -30
            arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
            arsPoints[user].points = arsPoints[user].points + points
            local currentPoints = arsPoints[user].points
            local transactionId = generateTransactionId()
            table.insert(transactions, {
                user = user,
                transactionid = transactionId,
                type = "Already Reviewed Project.",
                amount = 0,
                points = currentPoints,
                timestamp = currentTime
            })
            ao.send({ Target = m.From, Data = "You have already reviewed this Project." })
            return
        end

        -- Add review and update review table
        reviews.users[user] = { time = currentTime }
        reviews.count = reviews.count + 1
        table.insert(reviews.countHistory, { time = currentTime, count = reviews.count })

        -- Generate unique ID for the review
        local reviewId = generateReviewId()
        table.insert(reviews.reviews, {
            reviewId = reviewId,
            user = user,
            username = username,
            comment = comment,
            rating = rating,
            timestamp = currentTime,
            profileUrl = profileUrl,
            voters = {
                foundHelpful = {
                    count = 1,
                    countHistory = { { time = currentTime, count = 1 } },
                    users = { [user] = { time = currentTime } }
                },
                foundUnhelpful = {
                    count = 0,
                    countHistory = { { time = currentTime, count = 0 } },
                    users = {}
                }
            },
            replies = {}
        })

        -- Update points for the user and the app owner
        local points = 100
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points

        local AppOwner = Apps[appId].Owner
        local AppPoints = 50
        arsPoints[AppOwner] = arsPoints[AppOwner] or { user = AppOwner, points = 0 }
        arsPoints[AppOwner].points = arsPoints[AppOwner].points + AppPoints

        -- Update ratings table
        ratings.users[user] = { time = currentTime }
        ratings.count = ratings.count + 1
        ratings.Totalratings = ratings.Totalratings + rating
        table.insert(ratings.countHistory, { time = currentTime, count = ratings.count, rating = rating })

        local points = 200
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points
        local currentPoints = arsPoints[user].points
        local amount = 20 * 1000000000000
        ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(user)
        })
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = user,
            transactionid = transactionId,
            type = "Reviewed Project.",
            amount = amount,
            timestamp = currentTime
        })
        ao.send({ Target = m.From, Data = "Review added successfully." })
    end
)


-- Handler to view all transactions
Handlers.add(
    "view_transactions",
    Handlers.utils.hasMatchingTag("Action", "view_transactions"),
    function(m)
        local user = m.From
        local user_transactions = {}
        
        -- Filter transactions for the specific user
        for _, transaction in ipairs(transactions) do
            -- Skip nil transactions
            if transaction ~= nil and transaction.user == user then
                table.insert(user_transactions, transaction)
            end
        end
        
        -- Send the filtered transactions back to the user
        ao.send({ Target = user, Data = tableToJson(user_transactions) })
    end
)


Handlers.add(
    "AddReviewReply",
    Handlers.utils.hasMatchingTag("Action", "AddReviewReply"),
    function(m)
        -- Check required tags
        local requiredTags = { "AppId", "ReviewId", "username", "comment", "profileUrl" }
        for _, tag in ipairs(requiredTags) do
            if m.Tags[tag] == nil then
                ao.send({ Target = m.From, Data = tag .. " is missing or empty." })
                return
            end
        end
        local appId = m.Tags.AppId
        local reviewId = m.Tags.ReviewId
        local username = m.Tags.username
        local comment = m.Tags.comment
        local profileUrl = m.Tags.profileUrl
        local user = m.From
        local currentTime = getCurrentTime(m)

        -- Check if the user is the app owner
        if not Apps[appId] or Apps[appId].Owner ~= user then
            ao.send({ Target = m.From, Data = "Only the app owner can reply to reviews." })
            return
        end

        -- Find the target app and review
        if not reviewsTable[appId] or not reviewsTable[appId].reviews then
            ao.send({ Target = m.From, Data = "Reviews not found for this app." })
            return
        end

        local targetReview
        for _, review in ipairs(reviewsTable[appId].reviews) do
            if review.reviewId == reviewId then
                targetReview = review
                break
            end
        end

        if not targetReview then
            ao.send({ Target = m.From, Data = "Review not found." })
            return
        end

        -- Check if the user has already replied to this review
        if targetReview.replies then
            for _, reply in ipairs(targetReview.replies) do
                if reply.user == user then
                    ao.send({ Target = m.From, Data = "You have already replied to this review." })
                    return
                end
            end
        else
            targetReview.replies = {} -- Initialize replies table if not present
        end

        -- Generate a unique ID for the reply
        local replyId = generateReplyId()

        -- Add the reply to the target review
        table.insert(targetReview.replies, {
            replyId = replyId,
            user = user,
            profileUrl = profileUrl,
            username = username,
            comment = comment,
            timestamp = currentTime
        })

         local points = 15
       
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points
        local currentPoints = arsPoints[user].points
        local amount = 6 * 1000000000000
        local transactionId = generateTransactionId()
         ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(user)
        })
        table.insert(transactions, {
            user = user,
            transactionid = transactionId,
            type = "Replied to review.",
            amount = amount,
            timestamp = currentTime
        })

        ao.send({ Target = m.From, Data = "Reply added successfully." })
    end
)

Handlers.add(
    "MarkUnhelpfulReview",
    Handlers.utils.hasMatchingTag("Action", "MarkUnhelpfulReview"),
    function(m)
        local appId = m.Tags.AppId
        local reviewId = m.Tags.ReviewId
        local user = m.From
        local currentTime = getCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local username = m.Tags.username

        if not appId or not reviewId then
            ao.send({ Target = m.From, Data = "AppId and ReviewId are required." })
            return
        end

        if not reviewsTable[appId] then
            ao.send({ Target = m.From, Data = "App not found." })
            return
        end

        local review
        for _, r in ipairs(reviewsTable[appId].reviews) do
            if r.reviewId == reviewId then
                review = r
                break
            end
        end

        if not review then
            ao.send({ Target = m.From, Data = "Review not found." })
            return
        end

        local unhelpfulData = review.voters.foundUnhelpful
        local helpfulData = review.voters.foundHelpful

        if unhelpfulData.users[user] then
            ao.send({ Target = m.From, Data = "You have already marked this review as unhelpful." })
            return
        end

        if helpfulData.users[user] then
            helpfulData.users[user] = nil
            helpfulData.count = helpfulData.count - 1
            table.insert(helpfulData.countHistory, { time = currentTime, count = helpfulData.count })

            local points = -50
            arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
            arsPoints[user].points = arsPoints[user].points + points
            local currentPoints = arsPoints[user].points
            local transactionId = generateTransactionId()
            table.insert(transactions, {
                user = user,
                transactionid = transactionId,
                type = "Switched rating to unhelpful.",
                amount = 0,
                timestamp = currentTime
            })
        end

        unhelpfulData.users[user] = {username = username, voted = true, time = currentTime }
        unhelpfulData.count = unhelpfulData.count + 1
        table.insert(unhelpfulData.countHistory, { time = currentTime, count = unhelpfulData.count })

        local points = 50
      
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points
        local currentPoints = arsPoints[user].points
        local amount = 2 * 1000000000000
        local transactionId = generateTransactionId()
         ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(user)
        })
        table.insert(transactions, {
            user = user,
            transactionid = transactionId,
            type = "Marked Review as Unhelpful.",
            amount = amount,
            timestamp = currentTime
        })

        ao.send({ Target = m.From, Data = "Review marked as unhelpful successfully." })
    end
)


Handlers.add(
    "MarkHelpfulReview",
    Handlers.utils.hasMatchingTag("Action", "MarkHelpfulReview"),
    function(m)
        local appId = m.Tags.AppId
        local reviewId = m.Tags.ReviewId
        local user = m.From
        local currentTime = getCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local username = m.Tags.username

        if not appId or not reviewId then
            ao.send({ Target = m.From, Data = "AppId and ReviewId are required." })
            return
        end

        if not reviewsTable[appId] then
            ao.send({ Target = m.From, Data = "App not found." })
            return
        end

        local review
        for _, r in ipairs(reviewsTable[appId].reviews) do
            if r.reviewId == reviewId then
                review = r
                break
            end
        end

        if not review then
            ao.send({ Target = m.From, Data = "Review not found." })
            return
        end


        local helpfulData = review.voters.foundHelpful
       
        local unhelpfulData = review.voters.foundUnhelpful
        
        if helpfulData.users[user] then
            ao.send({ Target = m.From, Data = "You already marked this review as helpful." })
            return
        end

        if unhelpfulData.users[user] then
            unhelpfulData.users[user] = nil
            unhelpfulData.count = unhelpfulData.count - 1
            table.insert(unhelpfulData.countHistory, { time = currentTime, count = unhelpfulData.count })

            local points = -100
            arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
            arsPoints[user].points = arsPoints[user].points + points
            local currentPoints = arsPoints[user].points
            local transactionId = generateTransactionId()
            table.insert(transactions, {
                user = user,
                transactionid = transactionId,
                type = "Switched rating to helpful.",
                amount = 0,
                timestamp = currentTime
            })
        end

        helpfulData.users[user] = {username = username, voted = true, time = currentTime }
        helpfulData.count = helpfulData.count + 1
        table.insert(helpfulData.countHistory, { time = currentTime, count = helpfulData.count })

        local points = 50
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points
        local currentPoints = arsPoints[user].points
        local amount = 5 * 1000000000000
        ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(user)
        })
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = user,
            transactionid = transactionId,
            type = "Helpful Review  Rating.",
            amount = amount,
            timestamp = currentTime
        })

        ao.send({ Target = m.From, Data = "Review marked as helpful successfully." })
    end
)


Handlers.add(
    "TransferAppOwnership",
    Handlers.utils.hasMatchingTag("Action", "TransferAppOwnership"),
    function(m)
        local appId = m.Tags.AppId
        local newOwner = m.Tags.NewOwner
        local caller = m.From
        local currentTime = getCurrentTime()
        local currentOwner = m.Tags.currentOwner

        -- Check if PROCESS_ID called this handler
        if ARS ~= caller then
            ao.send({ Target = m.From, Data = "Only the main processID can call this handler" })
            return
        end

        if appId == nil then
            ao.send({ Target = m.From, Data = "appId is missing or empty." })
            return
        end

        if newOwner == nil then
            ao.send({ Target = m.From, Data = "NewOwner is missing or empty." })
            return
        end

        if currentOwner == nil then
            ao.send({ Target = m.From, Data = "NewOwner is missing or empty." })
            return
        end

        -- Check if the user making the request is the current owner
        if Apps[appId].Owner ~= currentOwner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        -- Transfer ownership
        reviewsTable[appId].Owner = newOwner
        reviewsTable[appId].mods[currentOwner] = newOwner

        local points = 35
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local transactionId = generateTransactionId()
         
        transactions[#transactions + 1] =  {
            user = newOwner,
            transactionid = transactionId,
            type = "Transfered Ownership.",
            amount = 0,
            points = userPointsData.points,
            timestamp = currentTime
        }
    end
)


Handlers.add(
    "ClearReviews",
    Handlers.utils.hasMatchingTag("Action", "ClearReviews"),
    function(m)
        reviewsTable = {}
    end
)