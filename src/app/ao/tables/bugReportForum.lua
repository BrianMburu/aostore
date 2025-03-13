local json = require("json")


-- This process details
PROCESS_NAME = "aos Bug_Report_Table"
PROCESS_ID = "x_CruGONBzwAOJoiTJ5jSddG65vMpRw9uMj9UiCWT5g"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
BugsReportsTable = BugsReportsTable or {}
AosPoints  = AosPoints or {}
Transactions = Transactions or {}

-- counters variables
BugReportCounter = BugReportCounter or 0
ReplyCounter = ReplyCounter or 0
TransactionCounter  = TransactionCounter or 0


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

-- Function to generate a unique review ID
function GenerateBugReportId()
    BugReportCounter = BugReportCounter + 1
    return "TX" .. tostring(BugReportCounter)
end

-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end

-- Function to generate a unique transaction ID
function GenerateReplyId()
    ReplyCounter = ReplyCounter + 1
    return "TX" .. tostring(ReplyCounter)
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



Handlers.add(
    "AddBugReportTable",
    Handlers.utils.hasMatchingTag("Action", "AddBugReportTable"),
    function(m)
        local currentTime = GetCurrentTime(m)
        local bugReportId = GenerateBugReportId()
        local replyId = GenerateReplyId()
        local appId = "TX61"
        local user  = m.From
        local profileUrl = m.Tags.profileUrl
        local username = m.Tags.username
        local caller = m.From
        
        print("Here is the caller Process ID"..caller)


        -- Field validation examples
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end

        -- Ensure global tables are initialized
        BugsReportsTable = BugsReportsTable or {}
        AosPoints = AosPoints or {}
        Transactions = Transactions or {}

        BugsReportsTable[appId] = {
            appId = appId,
            status = false,
            owner = user,
            mods = { [user] = { permissions = {replyBugReport = true, },  time = currentTime } },
            requests = {
            [bugReportId] = {
            bugReportId = bugReportId,
            user = user,
            profileUrl = profileUrl,
            edited = false,
            rank = "Architect",
            time = currentTime,
            username = username,
            comment = "Change the UI",
            header = "Front End Bug",
            status = "Open", -- Tracks status (e.g., "Open", "In Progress", "Resolved")
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
            replies = {
                [replyId] = {
                    replyId = replyId,
                    profileUrl = profileUrl,
                    username = username,
                    comment = "We will start working on that bug ASAP.",
                    timestamp = currentTime,
                    edited = false,
                    Rank = "Architect",
                    user = user,
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
            users = { [user] = { time = currentTime, count = 1 } }
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

        BugsReportsTable[#BugsReportsTable + 1] = {
            BugsReportsTable[appId]
        }

        AosPoints[#AosPoints + 1] = {
            AosPoints[appId]
        }

        local transactionType = "Project Creation."
        local amount = 0
        LogTransaction(user, appId, transactionType, amount, currentTime)

        -- Update statuses to true after creation
        BugsReportsTable[appId].status = true
        AosPoints[appId].status = true

        local status = true

         ao.send({
            Target = ARS,
            Action = "BugRespons",
            Data = tostring(status)
        })
        -- Send success response
        print("Successfully Added Bug Report Table table")
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
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Only the main process can call this Handler!."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Ensure appId exists in bugsReportsTable
        if bugsReportsTable[appId] == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App doesnt exist for  specified AppId.."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        -- Check if the user making the request is the current owner
        if bugsReportsTable[appId].Owner ~= Owner then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You are not the Owner of the App."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if appId == nil then
              local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if Owner == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = " Owner is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        bugsReportsTable[appId] = nil
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
             local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Only the main process can call this Handler!."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end



        if appId == nil then
              local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Ensure appId exists in bugsReportsTable
        if bugsReportsTable[appId] == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App doesnt exist for  specified AppId.."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        if newOwner == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "NewOwner is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if currentOwner == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "CurrentOwner is missing or empty."            
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Ensure appId exists in bugsReportsTable
        if bugsReportsTable[appId] == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App doesnt exist for  specified AppId.."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        -- Check if the user making the request is the current owner
        if bugsReportsTable[appId].Owner ~= currentOwner then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "You are not the owner of this app."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Transfer ownership
        bugsReportsTable[appId].Owner = newOwner
        bugsReportsTable[appId].mods[currentOwner] = newOwner

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
  SendSuccess(m.From, "Ticket created successfully")
    end
)




Handlers.add(
    "AddBugReport",
    Handlers.utils.hasMatchingTag("Action", "AddBugReport"),
    function(m)

        local appId = m.Tags.AppId
        local comment = m.Tags.comment
        local user = m.From
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local bugReportId = generateBugReportId()
        local currentTime = getCurrentTime(m)

        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if comment == nil then
              local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Comment is missing or empty."
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

         if profileUrl == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "profileUrl is missing or empty."            
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Ensure appId exists in bugsReportsTable
        if bugsReportsTable[appId] == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "No bug reports found for the specified AppId.."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        -- Get or initialize the app entry in the target table
        local targetEntry = bugsReportsTable[appId]

        -- Add user and update count
        targetEntry.users[user] = { voted = true, time = currentTime }
        targetEntry.count = targetEntry.count + 1
        table.insert(targetEntry.countHistory, { time = currentTime, count = targetEntry.count })

        -- Add the new entry
        table.insert(targetEntry.requests, {
            bugReportId = bugReportId,
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
            type = "FeatureRequest/BugReport",
            amount = amount,
            points = arsPoints[user].points,
            timestamp = currentTime
        })
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "Bug Report Added successfully"
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)

Handlers.add(
    "AddBugReportReply",
    Handlers.utils.hasMatchingTag("Action", "AddBugReportReply"),
    function(m)

        local appId = m.Tags.AppId
        local bugReportId = m.Tags.BugReportId
        local username = m.Tags.username
        local comment = m.Tags.comment
        local profileUrl = m.Tags.profileUrl
        local user = m.From
        local currentTime = getCurrentTime(m)

         if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        if comment == nil then
              local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Comment is missing or empty."
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

         if profileUrl == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "profileUrl is missing or empty."            
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Ensure appId exists in bugsReportsTable
        if bugsReportsTable[appId] == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "No bug reports found for the specified AppId.."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        -- Check if the user is the app owner
        if not bugsReportsTable[appId] or bugsReportsTable[appId].Owner ~= user or bugsReportsTable[appId].mods[user] ~= user then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Only the app owner or Mods can reply to bug reports."            
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        

        -- Locate the specific bug report in the requests list
        local bugReportEntry = nil
        for _, report in ipairs(bugsReportsTable[appId].requests) do
            if report.bugReportId == bugReportId then -- Match based on TableId (or BugReportId)
                bugReportEntry = report
                break
            end
        end

        -- Handle case where the bug report is not found
        if  bugReportEntry == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "Bug report not found for the specified AppId and BugReportId."            
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Check if the user has already replied to this bug report
        for _, reply in ipairs(bugReportEntry.replies) do
            if reply.user == user then
                local response = {}
                response.code = 404
                response.message = "failed"
                response.data = "You have already replied to this bug report."            
                ao.send({ Target = m.From, Data = tableToJson(response) })
                return
            end
        end

        -- Generate a unique ID for the reply
        local replyId = generateReplyId()

        -- Add the reply to the bug report
        table.insert(bugReportEntry.replies, {
            replyId = replyId,
            user = user,
            profileUrl = profileUrl,
            username = username,
            comment = comment,
            timestamp = currentTime
        })

        local points = 40
      
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points
        local currentPoints = arsPoints[user].points
        local amount = 5 * 1000000000000
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
            type = "Replied to Bug Report.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })
        local response = {}
        response.code = 200
        response.message = "success"
        response.data = "Reply added successfully."
        ao.send({ Target = m.From, Data = tableToJson(response) })
        end
)


Handlers.add(
    "FetchBugReports",
    Handlers.utils.hasMatchingTag("Action", "FetchBugReports"),
    function(m)
        local appId = m.Tags.AppId

        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Check if the app exists in the devForumTable table
        if not bugsReportsTable[appId] then
            ao.send({ Target = m.From, Data = "No info found for this app." })
            return
        end

        -- Ensure appId exists in bugsReportsTable
        if bugsReportsTable[appId] == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App Doesnt exist."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        -- Fetch the info
        local bugReportsInfo = bugsReportsTable[appId].requests

        -- Check if there are reviews
        if not bugReportsInfo or #bugReportsInfo == 0 then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "No reviews for this App."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        local response = {}
        response.code = 200
        response.message = "success"
        response.data = bugReportsInfo
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)

Handlers.add(
    "GetBugReportCount",
    Handlers.utils.hasMatchingTag("Action", "GetBugReportCount"),
    function(m)
        local appId = m.Tags.AppId

        if appId == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "appId is missing or empty."
            ao.send({ Target = m.From, Data = tableToJson(response) })
            return
        end

        -- Ensure appId exists in bugsReportsTable
        if bugsReportsTable[appId] == nil then
            local response = {}
            response.code = 404
            response.message = "failed"
            response.data = "App Doesnt exist."            
            ao.send({ Target = m.From, Data = tableToJson(response) })           
            return
        end

        local count = bugsReportsTable[appId].count or 0
        local response = { AppId = appId, reviewCount = count }
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
        
        -- Send the filtered transactions back to the user
        ao.send({ Target = user, Data = tableToJson(user_transactions) })
    end
)


Handlers.add(
    "ClearBugReportTable",
    Handlers.utils.hasMatchingTag("Action", "ClearBugReportTable"),
    function(m)
        bugsReportsTable = {}
    end
)