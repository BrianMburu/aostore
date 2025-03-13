local json = require("json")


-- This process details
PROCESS_NAME = "aos Favorites_Table"
PROCESS_ID = "2aXLWDFCbnxxBb2OyLmLlQHwPnrpN8dDZtB9Y9aEdOE"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
FavoritesTable = FavoritesTable or {}
AosPoints  = AosPoints or {}
Transactions = Transactions or {}
Tickets  = Tickets or {}

-- counters variables
TransactionCounter  = TransactionCounter or 0
FavoritesCounter = FavoritesCounter or 0
TicketCounter = TicketCounter or 0
TicketMessageCounter = TicketMessageCounter or 0
TicketMessageReplyCounter = TicketMessageReplyCounter or 0

-- Function to get the current time in milliseconds
function GetCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end


function TableToJson(tbl)
    local result = {}
    for key, value in pairs(tbl) do
        local valueType = type(value)
        if valueType == "table" then
            value = TableToJson(value)
            table.insert(result, string.format('"%s":%s', key, value))
        elseif valueType == "string" then
            table.insert(result, string.format('"%s":"%s"', key, value))
        elseif valueType == "number" then
            table.insert(result, string.format('"%s":%d', key, value))
        elseif valueType == "function" then
            table.insert(result, string.format('"%s":"%s"', key, tostring(value)))
        end
    end

    local json = "{" .. table.concat(result, ",") .. "}"
    return json
end
-- Function to get the current time in milliseconds
function GetCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end


-- Helper function to log transactions
function LogTransaction(user, appId, transactionType, amount, currentTime)
    local transactionId = GenerateTransactionId()
    local points = 5 
    AosPoints[appId].users[user] = AosPoints[appId].users[user].points + points
    local currentPoints = AosPoints[appId].users[user] or 0 -- Add error handling if needed
   
    Transactions[#Transactions + 1] = {
            user = user,
            transactionid = transactionId,
            transactionType = transactionType,
            amount = amount,
            points = currentPoints,
            timestamp = currentTime
        }
end

-- Response helper functions
function SendSuccess(target, message)
    ao.send({
        Target = target,
        Data = TableToJson({
            code = 200,
            message = "success",
            data = message
        })
    })
end

function SendFailure(target, message)
    ao.send({
        Target = target,
        Data = TableToJson({
            code = 404,
            message = "failed",
            data = message
        })
    })
end


function ValidateField(value, fieldName, target)
    if not value then
        SendFailure(target, fieldName .. " is missing or empty")
        return false
    end
    return true
end


-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end

-- Function to generate a unique ticket ID
function GenerateTicketId()
    TicketCounter = TicketCounter + 1
    return "TX" .. tostring(TicketCounter)
end

-- Function to generate a unique  message ID
function GenerateTicketId()
    TicketCounter = TicketCounter + 1
    return "TX" .. tostring(TicketCounter)
end

-- Function to generate a unique transaction ID
function GenerateFavoritesId()
    FavoritesCounter = FavoritesCounter + 1
    return "TX" .. tostring(FavoritesCounter)
end



Handlers.add(
    "AddFavoritesTableX",
    Handlers.utils.hasMatchingTag("Action", "AddFavoritesTableX"),
    function(m)
        local currentTime = GetCurrentTime(m)
        local appId = m.Tags.appId
        local user  = m.Tags.user
        local appName = m.Tags.appName
        local caller = m.From
        local protocol = m.Tags.protocol
        local websiteUrl  = m.Tags.websiteUrl
        local companyName = m.Tags.companyName
        local appIconUrl = m.Tags.appIconUrl
        local projectType = m.Tags.projectType


         if ARS ~= caller then
           SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end

        print("Here is the caller Process ID"..caller)
        if not ValidateField(appName, "profileUrl", m.From) then return end
        if not ValidateField(protocol, "protocol", m.From) then return end
        if not ValidateField(appName, "profileUrl", m.From) then return end
        if not ValidateField(websiteUrl, "websiteUrl", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(companyName, "companyName", m.From) then return end
        if not ValidateField(appIconUrl, "appIconUrl", m.From) then return end
        if not ValidateField(projectType, "projectType", m.From) then return end

        -- Ensure global tables are initialized
        FavoritesTable = FavoritesTable or {}
        AosPoints = AosPoints or {}
        Transactions = Transactions or {}

        FavoritesTable[appId] = {
            appId = appId,
            owner = user,
            appName = appName,
            protocol = protocol,
            websiteUrl = websiteUrl,
            companyName = companyName,
            appIconUrl = appIconUrl,
            projectType = projectType,
            status = false,
            count = 0,
            countHistory = { { time = currentTime, count = 0 } },
            users = {
                [user] = { rated = false , time = currentTime }
            }
        }
        AosPoints[appId] = {
            appId = appId,
            status = false,
            totalPointsApp = 5,
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { time = currentTime , points = 5 }
            }
        }

        FavoritesTable[#FavoritesTable + 1] = {
            FavoritesTable[appId]
        }

        AosPoints[#AosPoints + 1] = {
            AosPoints[appId]
        }
        local transactionType = "Project Creation."
        local amount = 0
        LogTransaction(user, appId, transactionType, amount, currentTime)
        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "FavoriteRespons",
            Data = tostring(status)
        })
        print("Successfully Added Favorites  table")
    end
)


Handlers.add(
    "AddAppToFavorites",
    Handlers.utils.hasMatchingTag("Action", "AddAppToFavorites"),
    function(m)
        local AppId = m.Tags.AppId
        local user = m.From
        local currentTime = getCurrentTime(m)

        if AppId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Ensure the app exists in the favorites table
        favoritesTable[AppId] = favoritesTable[AppId] or { users = {}, count = 0, countHistory = {} }
        local appFav = favoritesTable[AppId]

        -- Check if the user has already added this app to favorites
        if appFav.users[user] then
            local points = -30
            -- Deduct points for unnecessary action
            arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
            arsPoints[user].points = arsPoints[user].points + points
            local currentPoints = arsPoints[user].points

            -- Log the penalty transaction
            local transactionId = generateTransactionId()
            table.insert(transactions, {
                user = user,
                transactionid = transactionId,
                type = "Already Added to Favorites.",
                amount = 0,
                points = currentPoints,
                timestamp = currentTime
            })

            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You have already this app to your favorites."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Add the user to the favorites table
        appFav.users[user] = { voted = true, time = currentTime }
        appFav.count = appFav.count + 1

        -- Log the count change in favorites history
        table.insert(appFav.countHistory, { time = currentTime, count = appFav.count })

        -- Reward points and tokens for a first-time addition
        local points = 70
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points
        local currentPoints = arsPoints[user].points
        local amount = 4 * 1000000000000

        -- Send reward tokens
        ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(user)
        })

        -- Log the reward transaction
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = user,
            transactionid = transactionId,
            type = "Added to Favorites.",
            amount = amount,
            points = currentPoints,
            timestamp = currentTime
        })
        -- Debugging and confirmation message
        print("App added to favorites successfully!")
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "You have successfully add this App to your favorites"
        ao.send({ Target = m.From, Data = tableToJson(response) })
    
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
        if favoritesTable[appId].Owner ~= Owner then
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
        favoritesTable[appId] = nil
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
        if favoritesTable[appId].Owner ~= currentOwner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        -- Transfer ownership
        favoritesTable[appId].Owner = newOwner
        local points = 35
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local transactionId = generateTransactionId()
         
        transactions[#transactions + 1] =  {
            user = currentOwner,
            transactionid = transactionId,
            type = "Transfered Ownership.",
            amount = 0,
            points = userPointsData.points,
            timestamp = currentTime
        }
    end
)


Handlers.add(
    "getFavoriteApps",
    Handlers.utils.hasMatchingTag("Action", "getFavoriteApps"),
    function(m)
        local filteredFavorites = {}

        -- Loop through the favoritesTable to find the user's favorites
        for AppId, favorite in pairs(favoritesTable) do
            -- Check if the user exists in the `users` table for the current AppId
            if favorite.users[m.From] then
                -- Retrieve the app details from the Apps table
                local appDetails = Apps.apps[AppId]
                if appDetails then
                    -- Format the app details to include only the required fields
                    filteredFavorites[AppId] = {
                        AppIconUrl = appDetails.AppIconUrl,
                        AppId = AppId,
                        AppName = appDetails.AppName,
                        CompanyName = appDetails.CompanyName,
                        ProjectType = appDetails.ProjectType,
                        WebsiteUrl = appDetails.WebsiteUrl
                    }
                end
            end
        end

        -- Check if at least one App exist is provided
        if #filteredFavorites == 0 then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You have not added any Apps to Your favorites."            
            ao.send({ Target = m.From, Data = tableToJson(response) })
          return
        end
        -- Send the filtered favorites back to the user
        local response = {}
        response.code = 200
        response.message = "sucess"
        response.data = filteredFavorites
        ao.send({ Target = m.From, Data = tableToJson(response) })
        end
)



Handlers.add(
    "SendNotificationToInbox",
    Handlers.utils.hasMatchingTag("Action", "SendNotificationToInbox"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local Header = m.Tags.Header
        local LinkInfo = m.Tags.LinkInfo
        local sender = m.From
        local currentTime = getCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local MessageId = generateMessageId()

        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if message == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if Header == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Header is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if LinkInfo == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Link  is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Verify that the app exists
        local appDetails = favoritesTable[appId]
        if appDetails == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App not Found."
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        -- Verify that the sender is the owner of the app
        if appDetails.Owner ~= sender then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You are not authorized to send messages for this app."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Check if the app has any favorites
        local favorites = favoritesTable[appId]
        if favorites.users == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "No users have added your Projects to favorites."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Send the message to each user's inbox
        for userId, _ in pairs(favorites.users) do
            -- Function to initialize a user's inbox if it doesn't exist
            local function initializeUserInbox(userId)
                -- Initialize the user's inbox only if it doesn't exist
                if inboxTable[userId] == nil then
                    inboxTable[userId] = {
                        messages = {}, -- Messages stored as { [MessageId] = messageData }
                        UnreadMessages = 0 -- Counter for unread messages
                    }
                end
            end

            local function initializeSenderOutbox(sender)
                -- Initialize the user's inbox only if it doesn't exist
                if SentBoxTable[sender] == nil then
                    SentBoxTable[sender] = {
                        messages = {}, -- Messages stored as { [MessageId] = messageData }
                        SentMessages = 0 -- Counter for unread messages
                    }
                end
                SentBoxTable[sender] = SentBoxTable[sender] or {}
            end

            initializeUserInbox(userId)
            initializeSenderOutbox(sender)
            
            table.insert(inboxTable[userId].messages[MessageId], {
                AppId = appId,
                MessageId = MessageId,
                Read = false,
                AppName = appDetails.AppName,
                AppIconUrl = appDetails.AppIconUrl,
                Message = message,
                Header = Header,
                LinkInfo = LinkInfo,
                currentTime = currentTime
            })

            local UnreadMessages = inboxTable[userId].UnreadMessages

            UnreadMessages = UnreadMessages + 1

            table.insert(SentBoxTable[sender].messages[MessageId], {
                AppId = appId,
                MessageId = MessageId,
                Read = false,
                AppName = appDetails.AppName,
                AppIconUrl = appDetails.AppIconUrl,
                Message = message,
                Header = Header,
                LinkInfo = LinkInfo,
                currentTime = currentTime
            })
            local SentMessages = SentBoxTable[sender].SentMessages
            SentMessages =  SentMessages + 1 
        end

        local points = 50
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local amount = 0
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = sender,
            transactionid = transactionId,
            type = "Sent Messages to users.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })
        -- Send success message
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "Message Succesfully Sent."
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)

Handlers.add(
    "CreateTicket",
    Handlers.utils.hasMatchingTag("Action", "CreateTicket"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local Header = m.Tags.Header
        local LinkInfo = m.Tags.LinkInfo
        local sender = m.From
        local ticketId = generateTicketId()
        local currentTime = getCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local MessageId = generateMessageId()
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl

        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if message == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if Header == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Header is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if LinkInfo == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Link  is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Verify that the app exists
        local appDetails = favoritesTable[appId]
        if appDetails == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App not Found."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        local userId = favoritesTable[appId].Owner
        local function initializeAppInbox(userId)
            -- Initialize the user's inbox only if it doesn't exist
            if appTicketInboxTable[userId] == nil then
                appTicketInboxTable[userId] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    UnreadMessages = 0     -- Counter for unread messages
                }
            end
        end
        
        local function initializeUserSenderOutbox(sender)
                -- Initialize the user's inbox only if it doesn't exist
                if ticketSentBoxTable[sender] == nil then
                ticketSentBoxTable[sender] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    SentMessages = 0     -- Counter for unread messages
                    }
                end
            end

        initializeAppInbox(userId)
        initializeUserSenderOutbox(sender)
        table.insert(appTicketInboxTable[userId].messages[ticketId].message[MessageId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                Owner = userId,
                user = sender,
                username = username,
                profileUrl = profileUrl,
                Status = "Open",
                Message = message,
                Header = Header,
                LinkInfo = LinkInfo, 
                currentTime = currentTime,
                replies = {},
                Unreadreplies = 0
            })

            local UnreadMessages = appTicketInboxTable[userId].UnreadMessages
            UnreadMessages = UnreadMessages + 1

            table.insert(ticketSentBoxTable[sender].messages[ticketId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                user = sender,
                Status = "Open",
                username = username,
                profileUrl = profileUrl,
                Message = message,
                AppName = appDetails.AppName,
                AppIconUrl = appDetails.AppIconUrl,
                currentTime = currentTime,
                replies = {},
                Unreadreplies = 0
            })
            local SentMessages = ticketSentBoxTable[sender].SentMessages
            SentMessages =  SentMessages + 1 

        local points = 50
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local amount = 0
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = sender,
            transactionid = transactionId,
            type = "Created Ticket.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = userId,
            transactionid = transactionId,
            type = "Received Ticket.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })
        -- Send success message
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "Ticket  Succesfully Created."
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)

Handlers.add(
    "AddTicketMessage",
    Handlers.utils.hasMatchingTag("Action", "AddTicketMessage"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local sender = m.From
        local currentTime = getCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local MessageId = generateMessageId()
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local ticketId = m.Tags.ticketId
        
        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if message == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        -- Verify that the app exists
        local appDetails = favoritesTable[appId]
        if appDetails == nil then
           return
        end

        local userId = favoritesTable[appId].Owner
        local function initializeAppInbox(userId)
            -- Initialize the user's inbox only if it doesn't exist
            if appTicketInboxTable[userId] == nil then
                appTicketInboxTable[userId] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    UnreadMessages = 0     -- Counter for unread messages
                }
            end
        end
        
        local function initializeUserSenderOutbox(sender)
                -- Initialize the user's inbox only if it doesn't exist
            if ticketSentBoxTable[sender] == nil then
                ticketSentBoxTable[sender] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    SentMessages = 0     -- Counter for unread messages
                    }
            end
        end

        initializeAppInbox(userId)
        initializeUserSenderOutbox(sender)
        table.insert(appTicketInboxTable[userId].messages[ticketId].message[MessageId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                username = username,
                profileUrl = profileUrl,
                Status = "Open",
                Message = message,
                currentTime = currentTime,
                replies = {},
                Unreadreplies = 0
            })
            local UnreadMessages = appTicketInboxTable[userId].UnreadMessages
            UnreadMessages = UnreadMessages + 1
            table.insert(ticketSentBoxTable[sender].messages[ticketId].message[MessageId].replies[replyId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                Status = "Open",
                AppName = appDetails.AppName,
                AppIconUrl = appDetails.AppIconUrl,
                Message = message,
                currentTime = currentTime,
                replies = {},
                Unreadreplies = 0
            })
            local SentMessages = ticketSentBoxTable[sender].SentMessages
            SentMessages =  SentMessages + 1 

        local points = 50
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local amount = 0
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = sender,
            transactionid = transactionId,
            type = "Added message to."..ticketId,
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })
        -- Send success message
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "Ticket  Succesfully Created."
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)


Handlers.add(
    "AddTicketReply",
    Handlers.utils.hasMatchingTag("Action", "AddTicketReply"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local sender = m.From
        local currentTime = getCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local replyId = generateReplyId()
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local ticketId = m.Tags.ticketId
        local MessageId = m.Tags.MessageId
        
        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if message == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if ticketId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "ticketId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if MessageId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "MessageId is missing or empty."
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
        -- Verify that the app exists
        local appDetails = favoritesTable[appId]
        if appDetails == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App not Found."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        local userId = favoritesTable[appId].Owner
        local function initializeAppInbox(userId)
            -- Initialize the user's inbox only if it doesn't exist
            if appTicketInboxTable[userId] == nil then
                appTicketInboxTable[userId] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    UnreadMessages = 0     -- Counter for unread messages
                }
            end
        end
        
        local function initializeUserSenderOutbox(sender)
                -- Initialize the user's inbox only if it doesn't exist
            if ticketSentBoxTable[sender] == nil then
                ticketSentBoxTable[sender] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    SentMessages = 0     -- Counter for unread messages
                    }
            end
        end

        initializeAppInbox(userId)
        initializeUserSenderOutbox(sender)
        table.insert(appTicketInboxTable[userId].messages[ticketId].message[MessageId].replies[replyId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                username = username,
                profileUrl = profileUrl,
                Status = "Closed",
                Message = message,
                currentTime = currentTime,
                Unreadreplies = 0
            })
            local Unreadreplies = appTicketInboxTable[userId].messages[ticketId].message[MessageId].replies[replyId].Unreadreplies
            Unreadreplies = Unreadreplies + 1
            table.insert(ticketSentBoxTable[sender].messages[ticketId].message[MessageId].replies[replyId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                Status = "Open",
                AppName = appDetails.AppName,
                AppIconUrl = appDetails.AppIconUrl,
                Message = message,
                currentTime = currentTime,
                replies = {},
                Unreadreplies = 0
            })
            local SentMessages = ticketSentBoxTable[sender].messages[ticketId].message[MessageId].replies[replyId].Unreadreplies
            SentMessages = SentMessages + 1
        local points = 50
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local amount = 0
        local transactionId = generateTransactionId()
        table.insert(transactions, {
            user = sender,
            transactionid = transactionId,
            type = "Added message to."..ticketId,
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })
        -- Send success message
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "Ticket  Succesfully Created."
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)


Handlers.add(
    "DeleteTicket",
    Handlers.utils.hasMatchingTag("Action", "DeleteTicket"),
    function(m)
        

        local ticketId = m.Tags.ticketId
        local user = m.From

        -- Check ownership (both creator and app owner can delete)
        local appTicketFound, sentTicketFound
        for userId, messages in pairs(appTicketInboxTable[user]) do
            if messages[ticketId] then
                appTicketFound = messages[ticketId]
                break
            end
        end

        for sender, messages in pairs(ticketSentBoxTable[user]) do
            if messages[ticketId] then
                sentTicketFound = messages[ticketId]
                break
            end
        end

        -- Verify permission
        if not (appTicketFound and (appTicketFound.Owner == user or appTicketFound.user == user)) then
            ao.send({ Target = m.From, Data = tableToJson({ code = 403, message = "failed", data = "Unauthorized to delete ticket." }) })
            return
        end

        -- Delete ticket from all locations
        if appTicketFound then
            appTicketInboxTable[appTicketFound.Owner].tickets[ticketId] = nil
            appTicketInboxTable[appTicketFound.Owner].unreadCount = math.max(0, appTicketInboxTable[appTicketFound.Owner].unreadCount - 1)
        end

        if sentTicketFound then
            ticketSentBoxTable[sentTicketFound.user].tickets[ticketId] = nil
            ticketSentBoxTable[sentTicketFound.user].sentCount = math.max(0, ticketSentBoxTable[sentTicketFound.user].sentCount - 1)
        end

        -- Send response
        ao.send({ Target = m.From, Data = tableToJson({ code = 200, message = "success", data = "Ticket deleted successfully." }) })
    end
)



Handlers.add(
    "GetUserInbox",
    Handlers.utils.hasMatchingTag("Action", "GetUserInbox"),
    function(m)
        local userId = m.From

        -- Check if the user has any messages in their inbox
        local userInbox = inboxTable[userId] or {}
        if userInbox == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You dont have any messages."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

         -- Send success message
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = userInbox
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)

Handlers.add(
    "MarkUserMessageRead",
    Handlers.utils.hasMatchingTag("Action", "MarkUserMessageRead"),
    function(m)
        local userId = m.From
        local MessageId = m.Tags.MessageId

        -- Check if the user has any messages in their inbox
        local userInbox = inboxTable[userId].messages[MessageId]
        if userInbox == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message does not exist."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        local userMarked = inboxTable[userId].messages[MessageId].Read
        if userMarked then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Already Marked Message as Read."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        userMarked = true
          -- Send success message
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "Marked as Read succesfully. "
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)

Handlers.add(
    "GetUserUnreadMessagesCount",
    Handlers.utils.hasMatchingTag("Action", "GetUserUnreadMessagesCount"),
    function(m)
        local userId = m.From

        -- Check if the user has any messages in their inbox
        local userUnreadMessages = inboxTable[userId].UnreadMessages or 0
        if userUnreadMessages == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You dont have any messages."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Return the user's unreadMessages as a JSON object
        local response = {}
        response.code = 200
        response.message = "sucess"
        response.data = userUnreadMessages
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)


Handlers.add(
    "GetSenderSentBox",
    Handlers.utils.hasMatchingTag("Action", "GetSenderSentBox"),
    function(m)
        local userId = m.From

        -- Check if the user has any messages in their inbox
        local userInbox = SentBoxTable[userId] or {}

        if userInbox == nil then
        local response = {}
        response.code = 404
        response.message = "failed"
        response.data = "You dont have any messages in SentBox!."
        ao.send({ Target = m.From, Data = tableToJson(response) })
        return
        end
           -- Return the user's unreadMessages as a JSON object
        local response = {}
        response.code = 200
        response.message = "sucess"
        response.data = userInbox
        ao.send({ Target = m.From, Data = tableToJson(response) })
   
    end
)





Handlers.add(
    "GetUserStatistics",
    Handlers.utils.hasMatchingTag("Action", "GetUserStatistics"),
    function(m)
        local userId = m.From

        if userId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "UserId is mising or empty!."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Check if transactions table exists
        if not transactions then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Transactions table not found."
            ao.send({ Target = m.From, Data = tableToJson(response) })
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
        if hasTransactions == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You have no earnings."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end
        local response = {}
        response.code = 200
        response.message = "sucess"
        response.data = userStatistics
        ao.send({ Target = m.From, Data = tableToJson(response) })
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
           -- If no transactions found, return early
        if user_transactions == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You have no transactions."
            ao.send({ Target = m.From, Data = tableToJson(response) })
        return
        end
        local response = {}
        response.code = 200
        response.message = "sucess"
        response.data = user_transactions
        ao.send({ Target = m.From, Data = tableToJson(response) })
        end
)




Handlers.add(
    "ClearfavoritesTable",
    Handlers.utils.hasMatchingTag("Action", "ClearfavoritesTable"),
    function(m)
        favoritesTable = {}
    end
)





