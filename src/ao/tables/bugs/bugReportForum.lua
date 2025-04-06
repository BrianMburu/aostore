local json = require("json")


-- This process details
PROCESS_NAME = "aos Bug_Report_Table"
PROCESS_ID = "x_CruGONBzwAOJoiTJ5jSddG65vMpRw9uMj9UiCWT5g"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"



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
function GeneraterequestId()
    BugReportCounter = BugReportCounter + 1
    return "BX" .. tostring(BugReportCounter)
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
    local appData = BugsReportsTable[appId] or {}
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
    "AddBugReportTable",
    Handlers.utils.hasMatchingTag("Action", "AddBugReportTable"),
    function(m)
        local currentTime = m.Tags.currentTime
        local requestId = GeneraterequestId()
        local replyId = GenerateReplyId()
        local appId = m.Tags.appId
        local user  = m.Tags.user
        local profileUrl = m.Tags.profileUrl
        local username = m.Tags.username
        local caller = m.From
        
        print("Here is the caller Process ID"..caller)

        if ARS ~= caller then
           SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end
        -- Field validation examples
        if not ValidateField(currentTime, "currentTime", m.From) then return end
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
            [requestId] = {
            requestId = requestId,
            user = user,
            profileUrl = profileUrl,
            edited = false,
            rank = "Architect",
            createdTime = currentTime,
            username = username,
            description = "Change the UI",
            title = "Front End Bug",
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
                    description = "We will start working on that bug ASAP.",
                    createdTime = currentTime,
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
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
       
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

        local appId = m.Tags.appId
        local owner = m.Tags.owner
        local caller = m.From
        local currentTime = m.Tags.currentTime

        if ARS ~= caller then
            SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end
        
        -- Ensure appId exists in BugsReportsTable
        if BugsReportsTable[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        -- Check if the user making the request is the current owner
        if BugsReportsTable[appId].owner ~= owner then
            SendFailure(m.From, "You are not the Owner of the App.")
            return
        end

        if not ValidateField(currentTime, "currentTime", m.From) then return end   
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end
        
        local transactionType = "Deleted Project."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        BugsReportsTable[appId] = nil
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
        
        -- Ensure appId exists in BugsReportsTable
        if BugsReportsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if not ValidateField(currentTime, "currentTime", m.From) then return end  
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end

        -- Check if the user making the request is the current owner
        if BugsReportsTable[appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        BugsReportsTable[appId].owner = newOwner
        BugsReportsTable[appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
    end
)





Handlers.add(
    "AddBugReport",
    Handlers.utils.hasMatchingTag("Action", "AddBugReport"),
    function(m)
        -- Extract input parameters
        local appId = m.Tags.appId
        local description = m.Tags.description
        local user = m.From
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local title = m.Tags.title
        local providedRank = m.Tags.rank
        local currentTime = GetCurrentTime(m)

        -- Validate required fields
        if not ValidateField(appId, "appId", user) then return end
        if not ValidateField(description, "description", user) then return end
        if not ValidateField(username, "username", user) then return end
        if not ValidateField(profileUrl, "profileUrl", user) then return end
        if not ValidateField(title, "title", user) then return end
        if not ValidateField(providedRank, "providedRank", user) then return end

        -- Ensure FeatureRequestsTable exists for the given appId
        if BugsReportsTable[appId] == nil then
          SendFailure({m.From , "App does not exist"})
        end

        -- Get or initialize the app entry in the target table
        local targetEntry = BugsReportsTable[appId]

        -- Increment count and update count history
        BugsReportsTable[appId].count = (BugsReportsTable[appId].count or 0) + 1

        targetEntry.users[user] = { time = currentTime}

        targetEntry.countHistory[#targetEntry.countHistory + 1] = { time = currentTime, count = targetEntry.count }

        -- Generate unique feature request ID
        local requestId = GeneraterequestId()

        -- Determine user rank
        local finalRank = DetermineUserRank(user, appId, providedRank)

        -- Initialize voters structure
        local voters = {
            foundHelpful = {
                count = 0,
                countHistory = {{ time = currentTime, count = 0 } },
                users = {}
            },
            foundUnhelpful = {
                count = 0,
                countHistory = {{ time = currentTime, count = 0 }},
                users = {}
            }
        }
        
        -- Add the new feature request
        targetEntry.requests[requestId] = {
            requestId = requestId,
            user = user,
            username = username,
            edited = false,
            rank = finalRank,
            description = description,
            title = title,
            status = "Open",
            createdTime = currentTime,
            profileUrl = profileUrl,
            replies = {},
            voters = voters,
            statusHistory ={},
           
        }

        targetEntry.requests[requestId].statusHistory[#targetEntry.requests[requestId].statusHistory + 1] = { status = "Open", time = currentTime }

        -- Log transaction
        local transactionType = "Added Bug Report"
        local amount = 0
        local points = 5 -- Example points awarded for creating a feature request
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        -- Send success response
        local featureRequestInfo = targetEntry.requests[requestId]
        SendSuccess(user,featureRequestInfo)
    end
)


Handlers.add(
    "AddBugReportReply",
    Handlers.utils.hasMatchingTag("Action", "AddBugReportReply"),
    function(m)

        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local username = m.Tags.username
        local description = m.Tags.description
        local profileUrl = m.Tags.profileUrl
        local user = m.From
        local currentTime = GetCurrentTime(m)


        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end


        -- Ensure appId exists in BugsReportsTable
        if BugsReportsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        -- Check if the user is the app owner
        if not BugsReportsTable[appId] or BugsReportsTable[appId].owner ~= user or BugsReportsTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can reply to bug reports.")
        end

        -- Locate the specific bug report in the requests list
        local bugReportEntry = BugsReportsTable[appId].requests[requestId]


        -- Check if the user has already replied to this bug report
        for _, reply in ipairs(bugReportEntry.replies) do
            if reply.user == user then
                SendFailure(m.From, "You have already replied to this bug report.")
            end
        end

        -- Generate a unique ID for the reply
        local replyId = GenerateReplyId()

        local voters = {
            foundHelpful = {
                count = 0,
                countHistory = {{ time = currentTime, count = 0 } },
                users = {}
            },
            foundUnhelpful = {
                count = 0,
                countHistory = {{ time = currentTime, count = 0 }},
                users = {}
            }
        }
        bugReportEntry.replies[replyId] =  {
            replyId = replyId,
            user = user,
            profileUrl = profileUrl,
            username = username,
            description = description,
            createdTime = currentTime,
            voters = voters
        }

        bugReportEntry.status = "Closed"
        
        bugReportEntry.statusHistory[#bugReportEntry.statusHistory + 1] = { status = "Closed", time = currentTime }

        local transactionType = "Replied To Bug Report"
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        SendSuccess(m.From , "Replied Succesfully")

     end
)


Handlers.add(
    "EditBugReport",
    Handlers.utils.hasMatchingTag("Action", "EditBugReport"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local description = m.Tags.description
        local providedRank = m.Tags.rank
        local title = m.Tags.title

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end
        if not ValidateField(title, "title", m.From) then return end


        if not BugsReportsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if BugsReportsTable[appId].requests[requestId] == nil then
            SendFailure(m.From, "Bug Report doesnt exist for  specified AppId..")
            return
        end

        local report =  BugsReportsTable[appId].requests[requestId]

        if not report.user ~= user then
            SendFailure(m.From, "Only the owner can edit this bug report")
        end
        
        local finalRank = DetermineUserRank(m.From,appId, providedRank)

        report.title = title
        report.rank = finalRank
        report.description = description
        report.edited = true
        report.currentTime = currentTime
        report.status = "Open"

        report.statusHistory[#report.statusHistory + 1] = { status = "Open", time = currentTime }

        local transactionType = "Edited Bug Report  Succesfully."
        local amount = 0
        local points = -5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        local reportInfo =  BugsReportsTable[appId].requests[requestId]

        SendSuccess(m.From , reportInfo)   
    end
)


Handlers.add(
    "DeleteBugReportPost",
    Handlers.utils.hasMatchingTag("Action", "DeleteBugReportPost"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
     
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end
      

        if not BugsReportsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if BugsReportsTable[appId].requests[requestId] == nil then
            SendFailure(m.From, "Requests doesnt exist for  specified requestId..")
            return
        end

        local bugReport =  BugsReportsTable[appId].requests[requestId]

        if not bugReport.user ~= user then
            SendFailure(m.From, "Only the owner can Delete the DevForumPost")
        end

        local targetEntry = BugsReportsTable[appId]
        
        -- requests Effect.
        targetEntry.users[user] = {time = currentTime }
        targetEntry.count = targetEntry.count - 1
        targetEntry.countHistory[#targetEntry.countHistory + 1] = { time = currentTime, count = targetEntry.count }
        

        local transactionType = "Deleted feature Succesfully."
        local amount = 0
        local points = -10
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        bugReport = nil
        SendSuccess(m.From , "feature Edited Succesfully." )   
    end
)



Handlers.add(
    "MarkUnhelpfulBugReport",
    Handlers.utils.hasMatchingTag("Action", "MarkUnhelpfulBugReport"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end

        if BugsReportsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if BugsReportsTable[appId].requests[requestId] == nil then
            SendFailure(m.From, "BugReport  doesnt exist for  specified requestId..")
            return
        end

        local devForum =  BugsReportsTable[appId].requests[requestId]

        local unhelpfulData = devForum.voters.foundUnhelpful
        local helpfulData = devForum.voters.foundHelpful

        if unhelpfulData.users[user] then
            SendFailure(m.From, "You have already marked this BugReport as unhelpful.")
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
        
        local transactionType = "Marked Bug Report post Unhelpful."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked Bug Report post Unhelpful")
        end
)


Handlers.add(
    "MarkHelpfulBugReport",
    Handlers.utils.hasMatchingTag("Action", "MarkHelpfulBugReport"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp

        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end


        if not BugsReportsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if BugsReportsTable[appId].requests[requestId] == nil then
            SendFailure(m.From, "bugReport  post doesnt exist for  specified AppId..")
            return
        end

        local devForum =  BugsReportsTable[appId].requests[requestId]

        local helpfulData = devForum.voters.foundHelpful
       
        local unhelpfulData = devForum.voters.foundUnhelpful
        
        if helpfulData.users[user] then
            SendFailure(m.From , "You already marked this bug Report as helpful.")
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
        local transactionType = "Marked BugReport post  Helpful"
        local amount = 0
        local points = 3
        
        
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked the post as Helpful Succesfully" )   
    end
)


Handlers.add(
    "MarkUnhelpfulDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "MarkUnhelpfulDevForumReply"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
       
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if BugsReportsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if BugsReportsTable[appId].requests[requestId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local devForum =  BugsReportsTable[appId].requests[requestId].replies[replyId]

        local unhelpfulData = devForum.voters.foundUnhelpful
        local helpfulData = devForum.voters.foundHelpful

        if unhelpfulData.users[user].voted then
            SendFailure(m.From, "You have already marked this Bug Report reply as unhelpful.")
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

        local transactionType = "Marked BugReport reply Unhelpful."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked BugReport reply  Unhelpful")
        end
)


Handlers.add(
    "MarkHelpfulDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "MarkHelpfulDevForumReply"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local username = m.Tags.username

        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if not BugsReportsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if BugsReportsTable[appId].requests[requestId] == nil then
            SendFailure(m.From, "BugReport doesnt exist for  specified AppId..")
            return
        end

        if BugsReportsTable[appId].requests[requestId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local feature =  BugsReportsTable[appId].requests[requestId].replies[replyId] 

        local helpfulData = feature.voters.foundHelpful
       
        local unhelpfulData = feature.voters.foundUnhelpful
        
        if helpfulData.users[user].voted then
            SendFailure(m.From , "You already marked this BugReport reply as helpful.")
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
        local transactionType = "Marked  BugReport reply Helpful"
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked the  BugReport reply as Helpful Succesfully" )   
    end
)


Handlers.add(
    "EditBugReportReply",
    Handlers.utils.hasMatchingTag("Action", "EditBugReportReply"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local description = m.Tags.description
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        
        if not BugsReportsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if BugsReportsTable[appId].requests[requestId] == nil then
            SendFailure(m.From, "featureId doesnt exist for  specified AppId..")
            return
        end

        if BugsReportsTable[appId].requests[requestId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local reply =  BugsReportsTable[appId].requests[requestId].replies[replyId] 

        if not reply.user ~= user or BugsReportsTable[appId].owner ~= user or BugsReportsTable[appId].mod[user] ~= user then
            SendFailure(m.From, "Only the owner , mod or other mods can edit a reply. ")
        end

        reply.description = description
        reply.edited = true
        local transactionType = "Edited Reply.."
        local amount = 0
        local points = -3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Edited Reply Succesfully." )   
    end
)


Handlers.add(
    "DeleteDevForumReply",
    Handlers.utils.hasMatchingTag("Action", "DeleteDevForumReply"),
    function(m)
        local appId = m.Tags.appId
        local requestId = m.Tags.requestId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(requestId, "requestId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if not BugsReportsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if BugsReportsTable[appId].requests[requestId] == nil then
            SendFailure(m.From, "BugReport doesnt exist for  specified AppId..")
            return
        end

        if BugsReportsTable[appId].requests[requestId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local reply =  BugsReportsTable[appId].requests[requestId].replies[replyId] 

        if not reply.user ~= user or BugsReportsTable[appId].owner ~= user then
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
    "FetchBugReports",
    Handlers.utils.hasMatchingTag("Action", "FetchBugReports"),
    function(m)
        local appId = m.Tags.appId

        if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in BugsReportsTable
         if BugsReportsTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end
        -- Fetch the info
        local bugReportsInfo = BugsReportsTable[appId].requests

        SendSuccess(m.From , bugReportsInfo)
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


         -- Ensure appId exists in BugsReportsTable
        if BugsReportsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if BugsReportsTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = BugsReportsTable[appId]
        modlists.users[user] = { replyBugReport = true, time = currentTime }
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


         -- Ensure appId exists in BugsReportsTable
        if BugsReportsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if BugsReportsTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = BugsReportsTable[appId].mods
        
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

         -- Ensure appId exists in BugsReportsTable
        if BugsReportsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if BugsReportsTable[appId].owner ~= user or BugsReportsTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can view modlists.")
        end


        local modlists =  BugsReportsTable[appId].mods

        SendSuccess(user,modlists)
    end
)

Handlers.add(
    "GetBugReportCount",
    Handlers.utils.hasMatchingTag("Action", "GetBugReportCount"),
    function(m)
        local appId = m.Tags.appId

        if not ValidateField(appId, "appId", m.From) then return end
        -- Ensure appId exists in BugsReportsTable
        if BugsReportsTable[appId] == nil then
            SendFailure(m.From , "App not Found.")
            return
        end
        local count = BugsReportsTable[appId].count or 0
        SendSuccess(m.From , count)
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
            Action = "BugReportAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent bugReport handler aosPoints table")
    end
)




Handlers.add(
    "ClearBugReportTable",
    Handlers.utils.hasMatchingTag("Action", "ClearBugReportTable"),
    function(m)
        BugsReportsTable = {}
    end
)


Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)

        if m.From == ao.id then
            BugsReportsTable = {}
            AosPoints =  {}
            Transactions = Transactions or {}
            BugReportCounter = 0
            TransactionCounter = 0
            ReplyCounter = 0
    
        SendSuccess(m.From , "Succesfully deleted project")
        else
        SendFailure(m.From, "You do not have any transactions")
        end
    end
)
