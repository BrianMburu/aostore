local json = require("json")


-- This process details
PROCESS_NAME = "aos Favorites_Table"
PROCESS_ID = "2aXLWDFCbnxxBb2OyLmLlQHwPnrpN8dDZtB9Y9aEdOE"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"



-- tables 
FavoritesTable = FavoritesTable or {}
AosPoints  = AosPoints or {}
Transactions = Transactions or {}
Tickets  = Tickets or {}
SentBoxTable  = SentBoxTable or {}
InboxTableX = InboxTableX or {}

-- counters variables
TransactionCounter  = TransactionCounter or 0
FavoritesCounter = FavoritesCounter or 0
TicketCounter = TicketCounter or 0
TicketMessageCounter = TicketMessageCounter or 0
TicketMessageReplyCounter = TicketMessageReplyCounter or 0
MessageCounter = MessageCounter or 0

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
function LogTransaction(user, appId, transactionType, amount, currentTime, points)
    local transactionId = GenerateTransactionId()
   
    if AosPoints[appId].users[user] == nil then
         AosPoints[appId].users[user] = {points = 0, time = currentTime}
    end

    AosPoints[appId].users[user].points = AosPoints[appId].users[user].points + points
    local currentPoints = AosPoints[appId].users[user].points

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
            message = message,
            data = {}
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
    return "FX" .. tostring(FavoritesCounter)
end

-- Function to generate a unique App ID
function GenerateMessageId()
    MessageCounter = MessageCounter + 1
    return "MX" .. tostring(MessageCounter)
end


function DetermineUserRank(user, appId, providedRank)
    
    -- Get app data with safety checks
    local appData = FavoritesTable[appId] or {}
    local owner = appData.owner
    local mods = appData.mods or {}

    -- Determine rank priority
    if user == owner then
        return "Architect" -- Highest priority
    elseif mods[user] then
        return "Agent"     -- Secondary priority
    else
        return providedRank -- Default/fallback rank
    end
end


Handlers.add(
    "AddFavoritesTableX",
    Handlers.utils.hasMatchingTag("Action", "AddFavoritesTableX"),
    function(m)
        local currentTime = m.Tags.currentTime
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
        if not ValidateField(appName, "appName", m.From) then return end
        if not ValidateField(protocol, "protocol", m.From) then return end
        if not ValidateField(websiteUrl, "websiteUrl", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(companyName, "companyName", m.From) then return end
        if not ValidateField(appIconUrl, "appIconUrl", m.From) then return end
        if not ValidateField(projectType, "projectType", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

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
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { rated = true , time = currentTime }
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
        local points = 5
        LogTransaction(user, appId, transactionType, amount, currentTime,points)
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
    "AddAppToFavorite",
    Handlers.utils.hasMatchingTag("Action", "AddAppToFavorite"),
    function(m)
        local appId = m.Tags.appId
        local user = m.From
        local currentTime = GetCurrentTime(m)

        if not ValidateField(appId, "appId", m.From) then return end

        local appFav = FavoritesTable[appId]

        -- Check if the user has already added this app to favorites
        if appFav.users[user] then
            local transactionType = "Already added Projects to Favorites"
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
            SendFailure(m.From , "You have already Added this App to favorites.")
            return
        end

        -- Add the user to the favorites table
        appFav.users[user] = { rated = true, time = currentTime }
        appFav.count = appFav.count + 1

        appFav.countHistory[#appFav.countHistory+1] = { time = currentTime, count = appFav.count }
        local gift = 3
        local amount = gift * 1000

        -- Send reward tokens
        ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(user)
        })

        -- Reward points and tokens for a first-time addition
        local transactionType = "added Projects to Favorites"
        local amount = gift
        local points = 7
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

        -- Debugging and confirmation message
        print("App added to favorites successfully!")
        SendSuccess(m.From , "You have successfully Added this App to your Favorites.")
    end
)




Handlers.add(
    "DeleteApp",
    Handlers.utils.hasMatchingTag("Action", "DeleteApp"),
    function(m)

        local appId = m.Tags.appId
        local owner = m.Tags.owner
        local caller = m.From
        local currentTime = m.Tags.currentTime
        
         -- Check if PROCESS_ID called this handler
        if ARS ~= caller then
            SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end
      

        -- Check if the user making the request is the current owner
        if FavoritesTable[appId].owner ~= owner then
            SendFailure(m.From , "You are not the Owner of this App")
            return
        end

        FavoritesTable[appId] = nil
        local transactionType = "Deleted Project."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        print("Sucessfully Deleted App" )
    end
)

Handlers.add(
    "TransferAppOwnership",
    Handlers.utils.hasMatchingTag("Action", "TransferAppOwnership"),
    function(m)
        local appId = m.Tags.appId
        local newOwner = m.Tags.newOwner
        local caller = m.From
        local currentTime = m.Tags.currentTime
        local currentOwner = m.Tags.currentOwner

        -- Check if PROCESS_ID called this handler
        if ARS ~= caller then
            SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        -- Check if the user making the request is the current owner
        if FavoritesTable[appId].owner ~= currentOwner then
            SendFailure(m.From, "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        FavoritesTable[appId].owner = newOwner
        local transactionType = "Transfered Project"
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
     
    end
)


Handlers.add(
    "GetFavoriteApps",
    Handlers.utils.hasMatchingTag("Action", "GetFavoriteApps"),
    function(m)
        local user = m.From
        local filteredFavorites = {}

        -- Loop through the FavoritesTable to find the user's favorites
        for appId, favorite in pairs(FavoritesTable) do
            -- Check if the 'users' table exists and the user exists in it
            if favorite.users and favorite.users[user] then
                -- Retrieve the app details from the FavoritesTable (or if you meant to get from the Apps table, adjust accordingly)
                local appDetails = favorite  -- or: local appDetails = Apps.apps[appId]
                if appDetails then
                    filteredFavorites[appId] = {
                        appIconUrl = appDetails.appIconUrl,
                        appId = appId,
                        appName = appDetails.appName,
                        companyName = appDetails.companyName,
                        projectType = appDetails.projectType,
                        websiteUrl = appDetails.websiteUrl,
                        protocol = appDetails.protocol
                    }
                end
            end
        end

        print("Calling favorites")
        SendSuccess(m.From , filteredFavorites)
      end
)




Handlers.add(
    "SendMessage",
    Handlers.utils.hasMatchingTag("Action", "SendMessage"),
    function(m)
        local appId = m.Tags.appId
        local message = m.Tags.message
        local title = m.Tags.title
        local link = m.Tags.link
        local messageType = m.Tags.messageType
        local sender = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local messageId = GenerateMessageId()

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(message, "message", m.From) then return end
        if not ValidateField(title, "title", m.From) then return end
     --   if not ValidateField(link, "linkInfo", m.From) then return end
         if not ValidateField( messageType, "messageType", m.From) then return end


        -- Verify that the app exists
        local appDetails = FavoritesTable[appId]

        if appDetails == nil then
            SendFailure(m.From , "App not Found.")
         return
        end

        print ("owner :" ..FavoritesTable[appId].owner )

         print ("user :" .. sender )

        if FavoritesTable[appId].owner ~= sender  then
           SendFailure(m.From, "Only the app owner can send messages.")
           return
       end

        -- Check if the app has any favorites
        local favorites = FavoritesTable[appId]
        
        if favorites.users == nil then
            SendFailure(m.From , "No users have added your Projects to favorites.")
           return
        end


        -- Send the message to each user's inbox
        for userId, _ in pairs(favorites.users) do
            -- Function to initialize a user's inbox if it doesn't exist
            
            -- Function to initialize a user's inbox if it doesn't exist
    
            InboxTableX[userId] = InboxTableX[userId] or {}
            InboxTableX[userId].messages = InboxTableX[userId].messages or {}
            InboxTableX[userId].UnreadMessages = InboxTableX[userId].UnreadMessages or 0

 
            local message =  {
                appId = appId,
                messageId = messageId,
                read = false,
                appName = appDetails.appName,
                appIconUrl = appDetails.appIconUrl,
                message = message,
                title = title,
                link = link,
                messageType  =  messageType,
                currentTime = currentTime
             }
        
            InboxTableX[userId].messages[messageId] = message
            InboxTableX[userId].UnreadMessages = InboxTableX[userId].UnreadMessages + 1
        end

           
        SentBoxTable[sender] = SentBoxTable[sender] or {}
        SentBoxTable[sender].messages = SentBoxTable[sender].messages or {}
        SentBoxTable[sender].SentMessages = SentBoxTable[sender].SentMessages or 0
      
        local message = {
                appId = appId,
                messageId = messageId,
                read = false,
                appName = appDetails.appName,
                appIconUrl = appDetails.appIconUrl,
                message = message,
                title = title,
                link = link,
                currentTime = currentTime,
                 messageType  =  messageType,
             }

        SentBoxTable[sender].messages[messageId] = message
        SentBoxTable[sender].SentMessages = SentBoxTable[sender].SentMessages  + 1

        local transactionType = "Sent Message"
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        SendSuccess(m.From , "Message Succesfully Sent.")
      end
)

Handlers.add(
    "CreateTicket",
    Handlers.utils.hasMatchingTag("Action", "CreateTicket"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local title = m.Tags.title
        local LinkInfo = m.Tags.LinkInfo
        local user = m.From
        local ticketId = GenerateTicketId()
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local MessageId = GenerateMessageId()
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl

        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if message == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if title == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "title is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if LinkInfo == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Link  is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        -- Verify that the app exists
        local appDetails = FavoritesTable[appId]
        if appDetails == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App not Found."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end
        local userId = FavoritesTable[appId].Owner
        local function initializeAppInbox(userId)
            -- Initialize the user's inbox only if it doesn't exist
            if AppTicketInboxTable[userId] == nil then
                AppTicketInboxTable[userId] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    UnreadMessages = 0     -- Counter for unread messages
                }
            end
        end
        
        local function initializeUseruserOutbox(user)
                -- Initialize the user's inbox only if it doesn't exist
                if TicketSentBoxTable[user] == nil then
                TicketSentBoxTable[user] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    SentMessages = 0     -- Counter for unread messages
                    }
                end
            end

        initializeAppInbox(userId)
        initializeUseruserOutbox(user)
        table.insert(AppTicketInboxTable[userId].messages[ticketId].message[MessageId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                Owner = userId,
                user = user,
                username = username,
                profileUrl = profileUrl,
                Status = "Open",
                Message = message,
                title = title,
                LinkInfo = LinkInfo, 
                currentTime = currentTime,
                replies = {},
                Unreadreplies = 0
            })

            local UnreadMessages = AppTicketInboxTable[userId].UnreadMessages
            UnreadMessages = UnreadMessages + 1

            table.insert(TicketSentBoxTable[user].messages[ticketId], {
                AppId = appId,
                ticketId = ticketId,
                MessageId = MessageId,
                user = user,
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
            local SentMessages = TicketSentBoxTable[user].SentMessages
            SentMessages =  SentMessages + 1 

        local points = 50
        local userPointsData = GetOrInitializeUserPoints(userId)
        userPointsData.points = userPointsData.points + points
        local amount = 0
        local transactionId = GenerateTransactionId()
        table.insert(Transactions, {
            user = user,
            transactionid = transactionId,
            type = "Created Ticket.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })
        local transactionId = GenerateTransactionId()
        table.insert(Transactions, {
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
        ao.send({ Target = m.From, Data = TableToJson(response) })
    end
)

Handlers.add(
    "AddTicketMessage",
    Handlers.utils.hasMatchingTag("Action", "AddTicketMessage"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local MessageId = GenerateMessageId()
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local ticketId = m.Tags.ticketId
        local replyId = GenerateReplyId()
        
        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if message == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end
        -- Verify that the app exists
        local appDetails = FavoritesTable[appId]
        if appDetails == nil then
           return
        end

        local userId = FavoritesTable[appId].Owner
        local function initializeAppInbox(userId)
            -- Initialize the user's inbox only if it doesn't exist
            if AppTicketInboxTable[userId] == nil then
                AppTicketInboxTable[userId] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    UnreadMessages = 0     -- Counter for unread messages
                }
            end
        end
        
        local function initializeUseruserOutbox(user)
                -- Initialize the user's inbox only if it doesn't exist
            if TicketSentBoxTable[user] == nil then
                TicketSentBoxTable[user] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    SentMessages = 0     -- Counter for unread messages
                    }
            end
        end

        initializeAppInbox(userId)
        initializeUseruserOutbox(user)
        table.insert(AppTicketInboxTable[userId].messages[ticketId].message[MessageId], {
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
            local UnreadMessages = AppTicketInboxTable[userId].UnreadMessages
            UnreadMessages = UnreadMessages + 1
            table.insert(TicketSentBoxTable[user].messages[ticketId].message[MessageId].replies[replyId], {
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
            local SentMessages = TicketSentBoxTable[user].SentMessages
            SentMessages =  SentMessages + 1 

        local points = 50
        local userPointsData = GetOrInitializeUserPoints(userId)
        userPointsData.points = userPointsData.points + points
        local amount = 0
        local transactionId = GenerateTransactionId()
        table.insert(Transactions, {
            user = user,
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
        ao.send({ Target = m.From, Data = TableToJson(response) })
    end
)




Handlers.add(
    "AddTicketReply",
    Handlers.utils.hasMatchingTag("Action", "AddTicketReply"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local replyId = GenerateReplyId()
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local ticketId = m.Tags.ticketId
        local MessageId = m.Tags.MessageId
        
        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if message == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "message is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if ticketId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "ticketId is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if MessageId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "MessageId is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        if profileUrl == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "profileUrl is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end
        if username == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "username is missing or empty."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end
        -- Verify that the app exists
        local appDetails = FavoritesTable[appId]
        if appDetails == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App not Found."
            ao.send({ Target = m.From, Data = TableToJson(response) })
            return
        end

        local userId = FavoritesTable[appId].Owner
        local function initializeAppInbox(userId)
            -- Initialize the user's inbox only if it doesn't exist
            if AppTicketInboxTable[userId] == nil then
                AppTicketInboxTable[userId] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    UnreadMessages = 0     -- Counter for unread messages
                }
            end
        end
        
        local function initializeUseruserOutbox(user)
                -- Initialize the user's inbox only if it doesn't exist
            if TicketSentBoxTable[user] == nil then
                TicketSentBoxTable[user] = {
                    messages = {
                        message = {}, 
                    },         -- Messages stored as { [MessageId] = messageData }
                    SentMessages = 0     -- Counter for unread messages
                    }
            end
        end

        initializeAppInbox(userId)
        initializeUseruserOutbox(user)
        table.insert(AppTicketInboxTable[userId].messages[ticketId].message[MessageId].replies[replyId], {
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
            local Unreadreplies = AppTicketInboxTable[userId].messages[ticketId].message[MessageId].replies[replyId].Unreadreplies
            Unreadreplies = Unreadreplies + 1
            table.insert(TicketSentBoxTable[user].messages[ticketId].message[MessageId].replies[replyId], {
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
            local SentMessages = TicketSentBoxTable[user].messages[ticketId].message[MessageId].replies[replyId].Unreadreplies
            SentMessages = SentMessages + 1
        local points = 50
        local userPointsData = GetOrInitializeUserPoints(userId)
        userPointsData.points = userPointsData.points + points
        local amount = 0
        local transactionId = GenerateTransactionId()
        table.insert(Transactions, {
            user = user,
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
        ao.send({ Target = m.From, Data = TableToJson(response) })
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
        for userId, messages in pairs(AppTicketInboxTable[user]) do
            if messages[ticketId] then
                appTicketFound = messages[ticketId]
                break
            end
        end

        for user, messages in pairs(TicketSentBoxTable[user]) do
            if messages[ticketId] then
                sentTicketFound = messages[ticketId]
                break
            end
        end

        -- Verify permission
        if not (appTicketFound and (appTicketFound.Owner == user or appTicketFound.user == user)) then
            ao.send({ Target = m.From, Data = TableToJson({ code = 403, message = "failed", data = "Unauthorized to delete ticket." }) })
            return
        end

        -- Delete ticket from all locations
        if appTicketFound then
            AppTicketInboxTable[appTicketFound.Owner].tickets[ticketId] = nil
            AppTicketInboxTable[appTicketFound.Owner].unreadCount = math.max(0, AppTicketInboxTable[appTicketFound.Owner].unreadCount - 1)
        end

        if sentTicketFound then
            TicketSentBoxTable[sentTicketFound.user].tickets[ticketId] = nil
            TicketSentBoxTable[sentTicketFound.user].sentCount = math.max(0, TicketSentBoxTable[sentTicketFound.user].sentCount - 1)
        end

        -- Send response
        ao.send({ Target = m.From, Data = TableToJson({ code = 200, message = "success", data = "Ticket deleted successfully." }) })
    end
)


Handlers.add(
    "FetchFavoritesCount",
    Handlers.utils.hasMatchingTag("Action", "FetchFavoritesCount"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
         if FavoritesTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end

        local favoritesCount = FavoritesTable[appId].count


        SendSuccess(m.From , favoritesCount)
    end
)



Handlers.add(
    "FetchFavoritesCountHistory",
    Handlers.utils.hasMatchingTag("Action", "FetchFavoritesCountHistory"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
         if FavoritesTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end

        local favoritesCountHistory = FavoritesTable[appId].countHistory


        SendSuccess(m.From , favoritesCountHistory)
    end
)

 

Handlers.add(
    "GetUserInbox",
    Handlers.utils.hasMatchingTag("Action", "GetUserInbox"),
    function(m)
        local userId = m.From

         print ("userId :" .. userId )
        -- Initialize the user's inbox if it doesn't exist
        InboxTableX[userId] = InboxTableX[userId] or {}

        print ("InboxTableX :" .. json.encode(InboxTableX[userId]))
        InboxTableX[userId].messages = InboxTableX[userId].messages  or {}

        print ("InboxTableXmessages :" .. json.encode(InboxTableX[userId].messages))
        InboxTableX[userId].UnreadMessages = InboxTableX[userId].UnreadMessages or 0
 
        print ("InboxTableXUnreadmessages :" .. json.encode(InboxTableX[userId].UnreadMessages))
        -- Fetch the user's messages
        local userInbox = InboxTableX[userId].messages

         print ("messages :" .. json.encode(userInbox))

        -- Send success message with the inbox data
        SendSuccess(m.From, userInbox)
    end
)

Handlers.add(
    "MarkUserMessageRead",
    Handlers.utils.hasMatchingTag("Action", "MarkUserMessageRead"),
    function(m)
        local userId = m.From
        local messageId = m.Tags.messageId


        if not ValidateField(messageId, "messageId", m.From) then return end


        InboxTableX[userId] = InboxTableX[userId] or {}
        InboxTableX[userId].messages = InboxTableX[userId].messages  or {}
        InboxTableX[userId].UnreadMessages = InboxTableX[userId].UnreadMessages or 0


        local userMarked = InboxTableX[userId].messages[messageId].read
        if userMarked then
            SendFailure(m.From , "Already Marked Message as Read.")
           return
        end
        userMarked = true

        InboxTableX[userId].UnreadMessages = InboxTableX[userId].UnreadMessages - 1

        -- Send success message
        SendSuccess(m.From , "Marked as Read succesfully")
    end
)

Handlers.add(
    "GetUserUnreadMessagesCount",
    Handlers.utils.hasMatchingTag("Action", "GetUserUnreadMessagesCount"),
    function(m)
        local userId = m.From

        InboxTableX[userId] = InboxTableX[userId] or {}
        InboxTableX[userId].messages = InboxTableX[userId].messages or {}
        InboxTableX[userId].UnreadMessages = InboxTableX[userId].UnreadMessages or 0

        -- Check if the user has any messages in their inbox
        local userUnreadMessages = InboxTableX[userId].UnreadMessages 

        -- Return the user's unreadMessages as a JSON object
        SendSuccess(m.From ,userUnreadMessages )
       end
)


Handlers.add(
    "GetUserSentBox",
    Handlers.utils.hasMatchingTag("Action", "GetUserSentBox"),
    function(m)
        local userId = m.From

        
        SentBoxTable[userId] = SentBoxTable[userId] or {}
        SentBoxTable[userId].messages = SentBoxTable[userId].messages or {}
        SentBoxTable[userId].SentMessages = SentBoxTable[userId].SentMessages or 0

        
        -- Check if the user has any messages in their inbox
        local userInbox = SentBoxTable[userId].messages


        -- Return the user's unreadMessages as a JSON object
        SendSuccess(m.From , userInbox)
    end
)

Handlers.add(
    "GetUserDm",
    Handlers.utils.hasMatchingTag("Action", "GetUserDm"),
    function(m)
        local userId = m.From

        -- Check if the user has any messages in their inbox
        local userInbox = InboxTableX[userId].messages

        -- Return the user's unreadMessages as a JSON object
        SendSuccess(m.From , userInbox)
    end
)



Handlers.add(
    "GetUserStatistics",
    Handlers.utils.hasMatchingTag("Action", "GetUserStatistics"),
    function(m)
        local userId = m.From

        -- Check if transactions table exists
        if not Transactions then
            SendFailure(m.From , "Transactions table not found.")
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
        for _, transaction in pairs(Transactions) do
            if transaction.user == userId then
                hasTransactions = true


                -- Add transaction details to the statistics

                userStatistics.transactions[#userStatistics.transactions + 1] =  {
                    amount = transaction.amount,
                    time = transaction.timestamp
                }
                -- Increment total earnings
                userStatistics.totalEarnings = userStatistics.totalEarnings + transaction.amount
            end
        end

        -- If no transactions found, return early
        if hasTransactions == nil then
            SendFailure(m.From, "You have no earnings.")
            return
        end
        SendSuccess (m.From , userStatistics)
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
        for _, transaction in ipairs(Transactions) do
            -- Skip nil transactions
            if transaction ~= nil and transaction.user == user then
                user_transactions[#user_transactions + 1] =  transaction
            end
        end
           -- If no transactions found, return early
        if user_transactions == nil then
            SendFailure(m.From, "You have no transactions.")
            return
        end
        SendSuccess(m.From ,user_transactions )
        end
)


Handlers.add(
    "GetAosPointsTable",
    Handlers.utils.hasMatchingTag("Action", "GetAosPointsTable"),
    function(m)
        local caller = m.From

        print("Here is the caller Process ID"..caller)

        if AOS_POINTS ~= caller then
           SendFailure(m.From, "Only the AosPoints process can call this handler.")
            return
        end
        
        local aosPointsData = AosPoints 

        ao.send({
            Target = AOS_POINTS,
            Action = "FavoritesAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent favorites handler aosPoints table")
    end
)

Handlers.add(
    "ClearFavoritesTable",
    Handlers.utils.hasMatchingTag("Action", "ClearFavoritesTable"),
    function(m)
        FavoritesTable = {}
        AosPoints  = {}
        Transactions =  {}
        Tickets  =  {}
        TransactionCounter  =  0
        FavoritesCounter = 0
        TicketCounter =  0
    end
)

Handlers.add(
    "ClearInboxSentBox",
    Handlers.utils.hasMatchingTag("Action", "ClearInboxSentBox"),
    function(m)
        InboxTableX = {}
        SentBoxTable  = {}
    end
)



Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)

        if m.From == ao.id then
              FavoritesTable = {}
        AosPoints =  {}
        Transactions = Transactions or {}
        FavoritesCounter = 0
        TransactionCounter = 0
        ReplyCounter = 0
        SendSuccess(m.From , "Succesfully deleted project")
        else
        SendFailure(m.From, "You do not have any transactions")
        end
    end
)




