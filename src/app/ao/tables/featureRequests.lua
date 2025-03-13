local json = require("json")


-- This process details
PROCESS_NAME = "aos featureRequestsTable"
PROCESS_ID = "YGoIdaqLZauaH3aNLKyWdoFHTg0Voa5O3NhCMWKHRtY"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
featureRequestsTable = featureRequestsTable or {}
aosPoints  = aosPoints or {}
transactions = transactions or {}

-- counters variables
FeatureRequestCounter = FeatureRequestCounter or 0
ReplyCounter = ReplyCounter or 0
transactionCounter  = transactionCounter or 0



-- Function to get the current time in milliseconds
function getCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end

-- Function to generate a unique Dev forum ID
function generateFeatureRequestId()
    FeatureRequestCounter = FeatureRequestCounter + 1
    return "TX" .. tostring(FeatureRequestCounter)
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
    "AddfeatureRequestsTable",
    Handlers.utils.hasMatchingTag("Action", "AddfeatureRequestsTable"),
    function(m)
        local currentTime = getCurrentTime(m)
        local FeatureRequestId  = generateFeatureRequestId()
        local replyId = generateReplyId()
        local AppId = m.Tags.appId
        local user  = m.Tags.user
        local profileUrl = m.Tags.profileUrl
        local username = m.Tags.username
        local caller = m.From
        
        print("Here is the caller Process ID"..caller)

        if ARS ~= caller then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Only the main processID can call this handler"
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if user == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "user is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        
        if AppId == nil then
             local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        
        if profileUrl == nil then
             local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "profileUrl is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        
        if username == nil then
             local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "username is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        -- Ensure global tables are initialized
        featureRequestsTable = featureRequestsTable or {}
        aosPoints = aosPoints or {}
        transactions = transactions or {}

        featureRequestsTable[AppId] = {
            appId = AppId,
            status = false,
            Owner = user,
            mods = { [user] = { permissions = {replyFeatureRequests = true, },  time = currentTime } },
            requests = {
                [FeatureRequestId] = {
                FeatureRequestId = FeatureRequestId,
                user = user,
                time = currentTime,
                Rank = "Architect",
                edited = false,
                profileUrl = profileUrl,
                username = username,
                comment = "Hey, how do I get started on aocomputer?",
                header = "Integration and Dependencies",
                -- Thread status and history tracking
                status = "Open",  -- Possible values: Open, Resolved, Closed
                statusHistory = { { time = currentTime, status = "Open" } },
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
                -- Replies stored as a table with replyId as the key
                replies = {
                [replyId] = {
                    replyId = replyId,
                    user = user,
                    profileUrl = profileUrl,
                    edited = false,
                    username = username,
                    Rank = "Architect",
                    comment = "Hey, here is a link to get you started.",
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
                    
                }
            }
        }},
    count = 1,
    countHistory = { { time = currentTime, count = 1 } },
    users = { [user] = { time = currentTime , count = 1} }
}
         aosPoints[AppId] = {
            appId = AppId,
            status = false,
            TotalpointsApp = 5,
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { time = currentTime , points = 5 }
            }
        }

        featureRequestsTable[#featureRequestsTable + 1] = {
            featureRequestsTable[AppId]
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
        featureRequestsTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "FeatureRequestRespons",
            Data = tostring(status)
        })
        print("Successfully Added Feature Request table")
    end
)

Handlers.add(
    "DeleteApp",
    Handlers.utils.hasMatchingTag("Action", "DeleteApp"),
    function(m)

        local appId = m.Tags.AppId
        local Owner = m.Tags.Owner
        local caller = m.From

         -- Check if PROCESS_ID called this handler
        if ARS ~= caller then
            ao.send({ Target = m.From, Data = "Only the main processID can call this handler" })
            return
        end

        -- Check if the user making the request is the current owner
        if featureRequestsTable[appId].Owner ~= Owner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        if appId == nil then
            ao.send({ Target = m.From, Data = "appId is missing or empty." })
            return
        end

        if Owner == nil then
            ao.send({ Target = m.From, Data = "Owner is missing or empty." })
            return
        end

        featureRequestsTable[appId] = nil
        print("Sucessfully Deleted App" )

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
        if featureRequestsTable[appId].Owner ~= currentOwner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        -- Transfer ownership
        featureRequestsTable[appId].Owner = newOwner
        featureRequestsTable[appId].mods[currentOwner] = newOwner

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
    "AddFeatureRequest",
    Handlers.utils.hasMatchingTag("Action", "AddFeatureRequest"),
    function(m)

        -- Check if all required m.Tags are present
        local requiredTags = {
            "username", "profileUrl", "AppId", "comment", "TableType"
        }

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
        local featureRequestId = generateFeatureRequestId()
        local currentTime = getCurrentTime(m)

        -- Get or initialize the app entry in the target table
        local targetEntry = featureRequestsTable[appId]

        -- Add user and update count
        targetEntry.users[user] = { voted = true, time = currentTime }
        targetEntry.count = targetEntry.count + 1
        table.insert(targetEntry.countHistory, { time = currentTime, count = targetEntry.count })

        

        -- Add the new entry
        table.insert(targetEntry.requests, {
            featureRequestId = featureRequestId,
            user = user,
            username = username,
            comment = comment,
            timestamp = currentTime,
            profileUrl = profileUrl,
            replies = {},
        })

        -- Update points and send transaction
        local points = 100
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points

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
            type = "FeatureRequest",
            amount = amount,
            points = arsPoints[user].points,
            timestamp = currentTime
        })

        ao.send({ Target = m.From, Data = "Your entry has been added successfully." })
    end
)


Handlers.add(
    "AddFeatureRequestReply",
    Handlers.utils.hasMatchingTag("Action", "AddFeatureRequestReply"),
    function(m)
        -- Validate required tags
        local requiredTags = { "AppId", "FeatureRequestId", "username", "comment", "profileUrl" }
        for _, tag in ipairs(requiredTags) do
            if not m.Tags[tag] or m.Tags[tag] == "" then
                ao.send({ Target = m.From, Data = tag .. " is missing or empty." })
                return
            end
        end

        local appId = m.Tags.AppId
        local featureRequestId = m.Tags.FeatureRequestId
        local username = m.Tags.username
        local comment = m.Tags.comment
        local profileUrl = m.Tags.profileUrl
        local user = m.From
        local currentTime = getCurrentTime(m)

        -- Check if the user is the app owner
        if not Apps[appId] or Apps[appId].Owner ~= user then
            ao.send({ Target = m.From, Data = "Only the app owner can reply to feature requests." })
            return
        end

        -- Find the target feature request in the featureRequestsTable
        local featureRequestEntry = nil
        if featureRequestsTable[appId] and featureRequestsTable[appId].requests then
            for _, request in ipairs(featureRequestsTable[appId].requests) do
                if request.TableId == featureRequestId then
                    featureRequestEntry = request
                    break
                end
            end
        end

        if not featureRequestEntry then
            ao.send({ Target = m.From, Data = "Feature request not found for the specified AppId and FeatureRequestId." })
            return
        end

        -- Check if the user has already replied to this feature request
        for _, reply in ipairs(featureRequestEntry.replies) do
            if reply.user == user then
                ao.send({ Target = m.From, Data = "You have already replied to this feature request." })
                return
            end
        end

        -- Generate a unique ID for the reply
        local replyId = generateReplyId()

        -- Add the reply to the feature request
        table.insert(featureRequestEntry.replies, {
            replyId = replyId,
            user = user,
            profileUrl = profileUrl,
            username = username,
            comment = comment,
            timestamp = currentTime
        })

         local points = 40
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local amount = 5 * 1000000000000
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = user,
            transactionid = transactionId,
            type = "Replied To feature Request.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })

        -- Confirm success
        ao.send({ Target = m.From, Data = "Reply added successfully." })
    end
)

Handlers.add(
    "FetchFeaturesDataN",
    Handlers.utils.hasMatchingTag("Action", "FetchFeaturesDataN"),
    function(m)
        local appId = m.Tags.AppId

        -- Validate input
        if not appId then
            ao.send({ Target = m.From, Data = "AppId is missing." })
            return
        end

        -- Check if the app exists in the featureRequestsTable table
        if not featureRequestsTable[appId] then
            ao.send({ Target = m.From, Data = "No info found for this app." })
            return
        end

        -- Fetch the info
        local featuresInfo = featureRequestsTable[appId].requests

        -- Check if there are reviews
        if not featuresInfo or #featuresInfo == 0 then
            ao.send({ Target = m.From, Data = "No info available for this app." })
            return
        end

        -- Convert reviews to JSON for sending
        local reviewsJson = tableToJson(featuresInfo)
        -- Send the reviews back to the user
        ao.send({
            Target = m.From,
            Data = reviewsJson
        })
    end
)


Handlers.add(
    "GetFeatureRequestCount",
    Handlers.utils.hasMatchingTag("Action", "GetFeatureRequestCount"),
    function(m)
        local AppId = m.Tags.AppId
        if not AppId then
            ao.send({ Target = m.From, Data = "AppId is missing." })
            return
        end

        if not featureRequestsTable[AppId] then
            ao.send({ Target = m.From, Data = "No reviews found for AppId: " .. AppId })
            return
        end

        local count = featureRequestsTable[AppId].count or 0
        local response = { AppId = AppId, reviewCount = count }
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)



Handlers.add(
    "GetUserStatistics",
    Handlers.utils.hasMatchingTag("Action", "GetUserStatistics"),
    function(m)
        local userId = m.From

        if not userId then
            ao.send({ Target = m.From, Data = "UserId is required." })
            return
        end

        -- Check if transactions table exists
        if not transactions then
            ao.send({ Target = m.From, Data = "Error: Transactions table not found." })
            return
        end

        -- Initialize user statistics
        local userStatistics = {
            totalEarnings = 0,
            transactions = {}
        }

        -- Flag to track if user has transactions
        local hasTransactions = false

        -- Loop through the transactions table to gather user's data
        for _, transaction in pairs(transactions) do
            if transaction.user == userId then
                hasTransactions = true
                -- Add transaction details to the statistics
                table.insert(userStatistics.transactions, {
                    amount = transaction.amount,
                    time = transaction.timestamp
                })
                -- Increment total earnings
                userStatistics.totalEarnings = userStatistics.totalEarnings + transaction.amount
            end
        end

        -- If no transactions found, return early
        if not hasTransactions then
            ao.send({ Target = m.From, Data = "You have no earnings." })
            return
        end

        -- Send the user statistics back to the requester
        ao.send({
            Target = m.From,
            Data = tableToJson(userStatistics)
        })
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
    "FeautureRequestTable",
    Handlers.utils.hasMatchingTag("Action", "FeautureRequestTable"),
    function(m)
        featureRequestsTable = {}
    end
)