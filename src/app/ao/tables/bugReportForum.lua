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
bugsReportsTable = bugsReportsTable or {}
aosPoints  = aosPoints or {}
transactions = transactions or {}

-- counters variables
BugReportCounter = BugReportCounter or 0
ReplyCounter = ReplyCounter or 0
transactionCounter  = transactionCounter or 0



-- Function to get the current time in milliseconds
function getCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end

-- Function to generate a unique review ID
function generateBugReportId()
    BugReportCounter = BugReportCounter + 1
    return "TX" .. tostring(BugReportCounter)
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
    "AddBugReportTable",
    Handlers.utils.hasMatchingTag("Action", "AddBugReportTable"),
    function(m)
        local currentTime = getCurrentTime(m)
        local bugReportId = generateBugReportId()
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
        bugsReportsTable = bugsReportsTable or {}
        aosPoints = aosPoints or {}
        transactions = transactions or {}

        bugsReportsTable[AppId] = {
            appId = AppId,
            status = false,
            Owner = user,
            mods = { [user] = { permissions = {replyBugReport = true, },  time = currentTime } },
            requests = {
            [bugReportId] = {
            bugReportId = bugReportId,
            user = user,
            profileUrl = profileUrl,
            edited = false,
            Rank = "Architect",
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

        bugsReportsTable[#bugsReportsTable + 1] = {
            bugsReportsTable[AppId]
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
        bugsReportsTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "BugRespons",
            Data = tostring(status)
        })
        print("Successfully Added Bug Report Table table")
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