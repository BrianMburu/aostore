local json = require("json")


-- This process details
PROCESS_NAME = "aos DevForumTable"
PROCESS_ID = "xs_gSLAAdqPYPRhHrNmdyktmgiJBExWycxNahLKaPy4"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"



-- tables 
DevForumTable = DevForumTable or {}
AosPoints  = AosPoints or {}
Transactions = Transactions or {}

-- counters variables
DevForumCounter = DevForumCounter or 0
ReplyCounter = ReplyCounter or 0
TransactionCounter  = TransactionCounter or 0



-- Function to get the current time in milliseconds
function GetCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end

-- Function to generate a unique Dev forum ID
function GenerateDevForumId()
    DevForumCounter = DevForumCounter + 1
    return "DX" .. tostring(DevForumCounter)
end

-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end

-- Function to generate a unique transaction ID
function GenerateReplyId()
    ReplyCounter = ReplyCounter + 1
    return "RX" .. tostring(ReplyCounter)
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

function DetermineUserRank(user, appId, providedRank)
    
    -- Get app data with safety checks
    local appData = DevForumTable[appId] or {}
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
    "AddDevForumTable",
    Handlers.utils.hasMatchingTag("Action", "AddDevForumTable"),
    function(m)
       
        local devForumId = GenerateDevForumId()
        local replyId = GenerateReplyId()
        local appId = m.Tags.appId
        local user  = m.Tags.user
        local profileUrl = m.Tags.profileUrl
        local username   = m.Tags.username
         local currentTime = m.Tags.currentTime
        local caller = m.From
        
        print("Here is the caller Process ID"..caller)


         -- Field validation examples
        if not ValidateField(currentTime, "currentTime", m.From) then return end
         if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end

        -- Ensure global tables are initialized
        DevForumTable = DevForumTable or {}
        AosPoints = AosPoints or {}
        Transactions = Transactions or {}

        DevForumTable[appId] = {
            appId = appId,
            status = false,
            owner = user,
            mods = { [user] = { permissions = {replyDevForum = true, },  time = currentTime } },
            requests = {
                [devForumId] = {
                devForumId = devForumId,
                user = user,
                createdTime = currentTime,
                rank = "Architect",
                edited = false,
                profileUrl = profileUrl,
                topic = "Technical Requirements",
                username = username,
                description = "Hey, how do I get started on aocomputer?",
                title = "Integration and Dependencies",
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
                    rank = "Architect",
                    description = "Hey, here is a link to get you started.",
                    createdTime = currentTime,
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

        DevForumTable[#DevForumTable + 1] = {
            DevForumTable[appId]
        }

        AosPoints[#AosPoints + 1] = {
            AosPoints[appId]
        }

        local transactionType = "Project Creation."
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        DevForumTable[appId].status = true
        AosPoints[appId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "DevForumRespons",
            Data = tostring(status)
        })
        print("Successfully Added Dev Forum Table table")
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

        if ARS ~= caller then
            SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end


        if not ValidateField(currentTime, "currentTime", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end

        -- Check if the user making the request is the current owner
        if DevForumTable[appId].owner ~= owner then
            SendFailure(m.From, "You are not the Owner of the App.")
            return
        end

        DevForumTable[appId] = nil
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
        
        -- Ensure appId exists in DevForumTable
        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if not ValidateField(currentTime, "currentTime", m.From) then return end        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end

        -- Check if the user making the request is the current owner
        if DevForumTable[appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        DevForumTable[appId].owner = newOwner
        DevForumTable[appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
   
    end
)






Handlers.add(
    "AskDevForum",
    Handlers.utils.hasMatchingTag("Action", "AskDevForum"),
    function(m)
        
        local description = m.Tags.description
        local user = m.From
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local appId = m.Tags.appId
        local title = m.Tags.title
        local topic = m.Tags.topic
        local currentTime = GetCurrentTime(m)
        local devForumId = GenerateDevForumId()
        local providedRank = m.Tags.rank


        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(title, "title", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(topic, "topic", m.From) then return end
     
        -- Check if appId exists in DevForumTable, initialize if missing
        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
        end
        
        local targetEntry = DevForumTable[appId]
         
        -- Add user and update count
        targetEntry.users[user] = { voted = true, time = currentTime }
        targetEntry.count = targetEntry.count + 1
        
        targetEntry.countHistory[#targetEntry.countHistory + 1] = { time = currentTime, count = targetEntry.count }
        
        local finalRank = DetermineUserRank(m.From,appId, providedRank)

          -- Initialize voters structure
        local voters = {
            foundHelpful = {
                count = 0,
                countHistory = {},
                users = {}
            },
            foundUnhelpful = {
                count = 0,
                countHistory = {},
                users = {}
            }
        }
        
        -- Add the new entry
        targetEntry.requests[devForumId] = {
            devForumId = devForumId,
            user = user,
            username = username,
            description = description,
            edited = false,
            rank = finalRank,
            createdTime = currentTime,
            title = title,
            profileUrl = profileUrl,
            replies = {},
            topic = topic,
            voters = voters,
            statusHistory ={},
            status = "Open",
        }

        targetEntry.requests[devForumId].statusHistory[#targetEntry.requests[devForumId].statusHistory + 1] = { status = "Open", time = currentTime }

        local transactionType = "Added Dev Forum."
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

         local devForumInfo = DevForumTable[appId].requests[devForumId]
        SendSuccess(m.From , devForumInfo)
       end
)


Handlers.add(
    "AddDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "AddDevForumReply"),
    function(m)

        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local username = m.Tags.username
        local description = m.Tags.description
        local profileUrl = m.Tags.profileUrl
        local user = m.From
        local currentTime = GetCurrentTime(m)
        local replyId = GenerateReplyId()
        local providedRank = m.Tags.rank


        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end

        -- Ensure appId exists in DevForumTable
        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        -- Check if the user is the app owner
        if DevForumTable[appId].owner ~= user or DevForumTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can reply to bug reports.")
        end


         if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "feature doesnt exist for  specified AppId..")
            return
        end

        local devForumEntry =  DevForumTable[appId].requests[devForumId]


        -- Check if the user has already replied to this bug report
        for _, reply in ipairs(devForumEntry.replies) do
            if reply.user == user then
                SendFailure(m.From, "You have already replied to this bug report.")
            end
        end


        local finalRank = DetermineUserRank(m.From,appId, providedRank)


        local voters = {
            foundHelpful = {
                count = 0,
                countHistory = {},
                users = {}
            },
            foundUnhelpful = {
                count = 0,
                countHistory = {},
                users = {}
            }
        }
        devForumEntry.replies[replyId] =  {
            replyId = replyId,
            user = user,
            edited = false,
            rank = finalRank,
            profileUrl = profileUrl,
            username = username,
            description = description,
            createdTime = currentTime,
            voters = voters,

             
        }

        devForumEntry.status = "Closed"
        
        devForumEntry.statusHistory[#devForumEntry.statusHistory + 1] = { status = "Closed", time = currentTime }

        
        local transactionType = "Replied To Developer Report"
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

        local devForumInfo =  DevForumTable[appId].requests[devForumId].replies[replyId]

        SendSuccess(m.From , devForumInfo)
         end
)




Handlers.add(
    "EditDevForumRequest",
    Handlers.utils.hasMatchingTag("Action", "EditDevForumRequest"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local description = m.Tags.description
        local providedRank = m.Tags.rank
        local title = m.Tags.title
        local topic = m.Tags.topic

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end
        if not ValidateField(title, "title", m.From) then return end
        if not ValidateField(topic, "topic", m.From) then return end


        if not DevForumTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "feature doesnt exist for  specified AppId..")
            return
        end

        local feature =  DevForumTable[appId].requests[devForumId]

        if not feature.user ~= user then
            SendFailure(m.From, "Only the owner can Edit A feature")
        end
        
        local finalRank = DetermineUserRank(m.From,appId, providedRank)


        feature.title = title
        feature.rank = finalRank
        feature.description = description
        feature.edited = true
        feature.currentTime = currentTime
        feature.topic = topic

        local transactionType = "Edited feature Succesfully."
        local amount = 0
        local points = -5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        
        local devForumInfo = DevForumTable[appId].requests[devForumId]
       
        SendSuccess(m.From , devForumInfo)   
    end
)


Handlers.add(
    "FetchDevForumPost",
    Handlers.utils.hasMatchingTag("Action", "FetchDevForumPost"),
    function(m)
        local user = m.From
        local appId = m.Tags.appId 
        local devForumId = m.Tags.devForumId

      
        if not ValidateField(devForumId, "devForumId", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end

        if DevForumTable[appId].requests[devForumId]  == nil then
            SendFailure(m.From, "devforum post does not exists for that AppId..")
            return
        end

        -- Check if the Airdrop exists
        local devForumInfo = DevForumTable[appId].requests[devForumId]
        

        SendSuccess(m.From ,devForumInfo)

    end
)

Handlers.add(
    "DeleteDevForumAsk",
    Handlers.utils.hasMatchingTag("Action", "DeleteDevForumAsk"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
     
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end
      

        if not DevForumTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "Requests doesnt exist for  specified devForumId..")
            return
        end

        local devForum =  DevForumTable[appId].requests[devForumId]

        if not devForum.user ~= user then
            SendFailure(m.From, "Only the owner can Delete the DevForumPost")
        end

        local targetEntry = DevForumTable[appId]
        
        -- requests Effect.
        targetEntry.users[user] = {time = currentTime }
        targetEntry.count = targetEntry.count - 1
        targetEntry.countHistory[#targetEntry.countHistory + 1] = { time = currentTime, count = targetEntry.count }
        

        local transactionType = "Deleted feature Succesfully."
        local amount = 0
        local points = -10
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        devForum = nil
        SendSuccess(m.From , "feature Edited Succesfully." )   
    end
)





Handlers.add(
    "MarkUnhelpfulDevForumPost",
    Handlers.utils.hasMatchingTag("Action", "MarkUnhelpfulDevForumPost"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end

        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "DEvForumPost doesnt exist for  specified devForumId..")
            return
        end

        local devForum =  DevForumTable[appId].requests[devForumId]

        local unhelpfulData = devForum.voters.foundUnhelpful
        local helpfulData = devForum.voters.foundHelpful

        if unhelpfulData.users[user] then
            SendFailure(m.From, "You have already marked this DevForum as unhelpful.")
            return
        end

        if helpfulData.users[user] then
            helpfulData.users[user] = nil
            helpfulData.count = helpfulData.count - 1

            table.insert(helpfulData.countHistory,{ time = currentTime, count = helpfulData.count } )
            
            local transactionType = "Switched vote to unhelpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        end

        unhelpfulData.users[user] = { voted = true, time = currentTime }
        unhelpfulData.count = unhelpfulData.count + 1

        table.insert(unhelpfulData.countHistory, { time = currentTime, count = unhelpfulData.count })
        
        local transactionType = "Marked DevForum post Unhelpful."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked DevForum post Unhelpful")
        end
)


Handlers.add(
    "MarkHelpfulDevForumPost",
    Handlers.utils.hasMatchingTag("Action", "MarkHelpfulDevForumPost"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp

        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end


        if not DevForumTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "DevForumPost  post doesnt exist for  specified AppId..")
            return
        end

        local devForum =  DevForumTable[appId].requests[devForumId]

        local helpfulData = devForum.voters.foundHelpful
       
        local unhelpfulData = devForum.voters.foundUnhelpful
        
        if helpfulData.users[user] then
            SendFailure(m.From , "You already marked this post  as helpful.")
            return
        end

        if unhelpfulData.users[user] then
            unhelpfulData.users[user] = nil
            unhelpfulData.count = unhelpfulData.count - 1

            table.insert(unhelpfulData.countHistory,{ time = currentTime, count = unhelpfulData.count } )
            
            local transactionType = "Switched vote to helpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
       
        end

        helpfulData.users[user] = { voted = true, time = currentTime }
        helpfulData.count = helpfulData.count + 1

        table.insert(helpfulData.countHistory, { time = currentTime, count = helpfulData.count })
        local transactionType = "Marked DevForumPost post  Helpful"
        local amount = 0
        local points = 0
        
        
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked the post as Helpful Succesfully" )   
    end
)



Handlers.add(
    "MarkUnhelpfulDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "MarkUnhelpfulDevForumReply"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
       
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if DevForumTable[appId].requests[devForumId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local devForum =  DevForumTable[appId].requests[devForumId].replies[replyId]

        local unhelpfulData = devForum.voters.foundUnhelpful
        local helpfulData = devForum.voters.foundHelpful

        if unhelpfulData.users[user].voted then
            SendFailure(m.From, "You have already marked this DevForum reply as unhelpful.")
            return
        end

        if helpfulData.users[user].voted then
            helpfulData.users[user] = nil
            helpfulData.count = helpfulData.count - 1

            helpfulData.countHistory[#helpfulData.countHistory + 1] = { time = currentTime, count = helpfulData.count }
            
            local transactionType = "Switched vote to unhelpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        end

        unhelpfulData.users[user] = { voted = true, time = currentTime }
        unhelpfulData.count = unhelpfulData.count + 1

        unhelpfulData.countHistory[#unhelpfulData.countHistory + 1] = { time = currentTime, count = unhelpfulData.count }

        local transactionType = "Marked DevForum reply Unhelpful."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked DevForum reply  Unhelpful")
        end
)


Handlers.add(
    "MarkHelpfulDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "MarkHelpfulDevForumReply"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local username = m.Tags.username

        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if not DevForumTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "feature doesnt exist for  specified AppId..")
            return
        end

        if DevForumTable[appId].requests[devForumId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local feature =  DevForumTable[appId].requests[devForumId].replies[replyId] 

        local helpfulData = feature.voters.foundHelpful
       
        local unhelpfulData = feature.voters.foundUnhelpful
        
        if helpfulData.users[user].voted then
            SendFailure(m.From , "You already marked this DevForum reply as helpful.")
            return
        end

        if unhelpfulData.users[user] then
            unhelpfulData.users[user] = nil
            unhelpfulData.count = unhelpfulData.count - 1

            unhelpfulData.countHistory[#unhelpfulData.countHistory + 1] = { time = currentTime, count = unhelpfulData.count }
            
            local transactionType = "Switched vote to helpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        end

        helpfulData.users[user] = {username = username, voted = true, time = currentTime }
        helpfulData.count = helpfulData.count + 1
        helpfulData.countHistory[#helpfulData.countHistory + 1] = { time = currentTime, count =helpfulData.count }
        local transactionType = "Marked  DevForum reply Helpful"
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked the  DevForum reply as Helpful Succesfully" )   
    end
)


Handlers.add(
    "EditDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "EditDevForumReply"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local description = m.Tags.description
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end

        if not DevForumTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "featureId doesnt exist for  specified AppId..")
            return
        end

        if DevForumTable[appId].requests[devForumId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local reply =  DevForumTable[appId].requests[devForumId].replies[replyId] 

        if not reply.user ~= user or DevForumTable[appId].owner ~= user or DevForumTable[appId].mod[user] ~= user then
            SendFailure(m.From, "Only the owner , mod or other mods can edit a reply. ")
        end

        reply.description = description
        reply.edited = true
        local transactionType = "Edited Reply.."
        local amount = 0
        local points = -3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        
        
        local devForumInfo = DevForumTable[appId].requests[devForumId].replies[replyId]

        SendSuccess(m.From , devForumInfo)   
    end
)


Handlers.add(
    "DeleteDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "DeleteDevForumReply"),
    function(m)
        local appId = m.Tags.appId
        local devForumId = m.Tags.devForumId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(devForumId, "devForumId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if not DevForumTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if DevForumTable[appId].requests[devForumId] == nil then
            SendFailure(m.From, "feature doesnt exist for  specified AppId..")
            return
        end

        if DevForumTable[appId].requests[devForumId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local reply =  DevForumTable[appId].requests[devForumId].replies[replyId] 

        if not reply.user ~= user or DevForumTable[appId].owner ~= user then
            SendFailure(m.From, "Only the owner , mod or other mods can edit a reply. ")
        end
        local transactionType = "Deleted  Reply.."
        local amount = 0
        local points = -3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        reply = nil
        SendSuccess(m.From , "Deleted Reply. " )   
    end
)



Handlers.add(
    "FetchDevForumData",
    Handlers.utils.hasMatchingTag("Action", "FetchDevForumData"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in DevForumTable
         if DevForumTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end
        -- Fetch the info
        local devForumInfo = DevForumTable[appId].requests

        SendSuccess(m.From , devForumInfo)
    end
)

Handlers.add(
    "AddModerator",
    Handlers.utils.hasMatchingTag("Action", "AddModerator"),
    function(m)

        local appId = m.Tags.appId
        local modId = m.Tags.modId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(modId , "modId", m.From) then return end


         -- Ensure appId exists in DevForumTable
        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if DevForumTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = DevForumTable[appId]
        modlists.users[user] = { replyDevForum = true, time = currentTime }
        local transactionType = "Added Moderator.."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
      
        SendSuccess(user,modlists)
    end
)

Handlers.add(
    "RemoveModerator",
    Handlers.utils.hasMatchingTag("Action", "RemoveModerator"),
    function(m)

        local appId = m.Tags.appId
        local modId = m.Tags.modId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(modId , "modId", m.From) then return end


         -- Ensure appId exists in DevForumTable
        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if DevForumTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = DevForumTable[appId].mods
        
        modlists.users[user] = nil

        local transactionType = "Removed Moderator.."
        local amount = 0
        local points = 2
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(user,modlists)
    end
)

Handlers.add(
    "FetchModsLists",
    Handlers.utils.hasMatchingTag("Action", "FetchModsLists"),
    function(m)

        local appId = m.Tags.appId
        local user = m.From

        if not ValidateField(appId, "appId", m.From) then return end

         -- Ensure appId exists in DevForumTable
        if DevForumTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if DevForumTable[appId].owner ~= user or DevForumTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can view modlists.")
        end


        local modlists =  DevForumTable[appId].mods

        SendSuccess(user,modlists)
    end
)

Handlers.add(
    "GetDevForumCount",
    Handlers.utils.hasMatchingTag("Action", "GetDevForumCount"),
    function(m)
        local appId = m.Tags.appId

        if not ValidateField(appId, "appId", m.From) then return end
        -- Ensure appId exists in DevForumTable
        if DevForumTable[appId] == nil then
            SendFailure(m.From , "App not Found.")
            return
        end
        local count = DevForumTable[appId].count 
        SendSuccess(m.From , count)
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
            Action = "DevForumAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent devForum handler aosPoints table")
    end
)



Handlers.add(
    "ClearDevForumTable",
    Handlers.utils.hasMatchingTag("Action", "ClearDevForumTable"),
    function(m)
        DevForumTable = {}
    end
)


Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)

        if m.From == ao.id then
            DevForumTable = {}
            AosPoints =  {}
            Transactions = Transactions or {}
            DevForumCounter = 0
            TransactionCounter = 0
            ReplyCounter = 0
        SendSuccess(m.From , "Succesfully deleted project")
        else
        SendFailure(m.From, "You do not have any transactions")
        end
    end
)
