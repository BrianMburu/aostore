local json = require("json")
local math = require("math")



-- This process details
PROCESS_NAME = "aos Tasks_Table"
PROCESS_ID = "a_YRsw_22Dw5yPdQCUmVFAeI8J3OUsCGc_z0KrtEvNg"

-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Stakers process details
PROCESS_NAME = "aos Stakers_Table"
PROCESS_ID_AOS_STAKERS = "95butVk7xiquzqadgbqrrFtKCPtaEumi27ckEnIN4ww"



-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"


TaskTable = TaskTable or {}
AosPoints = AosPoints or {}
Transactions = Transactions or {}

TransactionCounter = TransactionCounter or 0
TaskCounter = TaskCounter or 0
ReplyCounter = ReplyCounter or 0




function Universal_sanitize(data)
    if type(data) == "number" then
        -- Handle integer-like numbers
        if math.tointeger(data) then
            return tostring(math.floor(data))
        end
        
        -- For floating numbers, preserve full precision but ensure proper formatting
        local formatted = string.format("%.16g", data)
        
        -- Avoid scientific notation for common decimal ranges
        if not formatted:find("e") and not formatted:find("E") then
            return formatted
        end
        
        -- Fallback to precise string conversion
        return tostring(data)
    elseif type(data) == "table" then
        local sanitized = {}
        for k, v in pairs(data) do
            sanitized[Universal_sanitize(k)] = Universal_sanitize(v)
        end
        return sanitized
    end
    return data
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


-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end

-- Function to generate a unique transaction ID
function GenerateTaskId()
    TaskCounter = TaskCounter + 1
    return "PX" .. tostring(TaskCounter)
end

-- Function to generate a unique transaction ID
function GenerateReplyId()
    ReplyCounter = ReplyCounter + 1
    return "RX" .. tostring(ReplyCounter)
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
            transactionId = transactionId,
            transactionType = transactionType,
            amount = amount,
            points = currentPoints,
            createdTime = currentTime
        }
end



function DetermineUserRank(user, appId, providedRank)
    
    -- Get app data with safety checks
    local appData = TaskTable[appId] or {}
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
    "AddTaskTable",
    Handlers.utils.hasMatchingTag("Action", "AddTaskTable"),
    function(m)
        -- Convert and validate numeric fields
        local currentTime = tonumber(m.Tags.currentTime)
        local appId = m.Tags.appId
        local user = m.Tags.user
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local replyId = GenerateReplyId()
        local taskId = GenerateTaskId()

        -- Validate essential fields
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end

        -- Initialize global tables properly
        TaskTable = TaskTable or {}
        AosPoints = AosPoints or {}

        -- Calculate numeric values safely
        local tasksAmount = 50000
        local taskerCount = 500
        local amountPerTask = tasksAmount / taskerCount  -- 100

        -- Create task structure with proper numeric types
        TaskTable[appId] = {
            appId = appId,
            status = true,  -- Set status immediately
            owner = user,
            count = 1,
            countHistory = {{
                time = currentTime,
                count = 1
            }},
            users = {
                [user] = { time = currentTime }
            },
            mods = {
                [user] = {
                    permissions = { replyTask = true },
                    time = currentTime
                }
            },
            tasks = {
                [taskId] = {
                    taskId = taskId,
                    createdTime = currentTime,
                    link = "https://x.com/aoTheComputer",
                    task = "Follow, Retweet, and Like our Twitter page",
                    description = "Launched on aostore",
                    tasksAmount = tasksAmount,
                    taskerCount = taskerCount,
                    amountPerTask = amountPerTask,
                    title = "aostore tasks",
                    tokenDenomination = 1000,  -- Explicit numeric value
                    tokenId = ARS,  -- Ensure ARS is defined
                    completedRate = {
                        completeCount = 0,  -- Start at 0
                        remainingTasks = taskerCount
                    },
                    replies = {
                        [replyId] = {
                            replyId = replyId,
                            username = username,
                            user = user,
                            profileUrl = profileUrl,
                            url = "https://x.com/aoTheComputer",
                            status = "Pending",
                            rank = "Architect",
                            completedTasks = {
                                completed = false,
                                completedTime = currentTime,
                                proof = "https://x.com/aoTheComputer",
                                amount = amountPerTask
                            }
                        }
                    }
                }
            }
        }

        -- Initialize points system
        AosPoints[appId] = {
            appId = appId,
            status = true,
            totalPointsApp = 5,
            count = 1,
            countHistory = {{
                time = currentTime,
                count = 1
            }},
            users = {
                [user] = {
                    time = currentTime,
                    points = 5
                }
            }
        }

        -- Log transaction
        LogTransaction(m.From, appId, "Project Creation", 0, currentTime, 5)

        -- Send response
        ao.send({
            Target = ARS,
            Action = "TaskRespons",
            Data = "true"
        })

        print("Successfully initialized task system for app: "..appId)
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

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        
        -- Ensure appId exists in Tokens
        if TaskTable[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        -- Check if the user making the request is the current owner
        if TaskTable[appId].owner ~= owner then
            SendFailure(m.From, "You are not the Owner of the App.")
            return
        end
        
       
        local transactionType = "Deleted Project."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        TaskTable[appId] = nil
        print("Sucessfully Deleted App" )
    end
)

Handlers.add(
    "TransferAppOwnership",
    Handlers.utils.hasMatchingTag("Action", "TransferAppOwnership"),
    function(m)
        local appId = m.Tags.appId
        local newOwner = m.Tags.NewOwner
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

        -- Ensure appId exists in Tokens
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end
        
        -- Check if the user making the request is the current owner
        if TaskTable[appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        TaskTable[appId].owner = newOwner
        TaskTable[appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
    end
)






Handlers.add(
    "DepositConfirmedAddNewTask",
    Handlers.utils.hasMatchingTag("Action", "DepositConfirmedAddNewTask"),
    function(m)
        local userId = m.From
        local appId = m.Tags.appId
        local tokenId = m.Tags.tokenId
        local tokenDenomination = tonumber(m.Tags.tokenDenomination)  -- Convert to number
        local amount = tonumber(m.Tags.amount)
        local currentTime = m.Timestamp
        local taskId = GenerateTaskId()

        print ("Deposit Timestamp" .. currentTime)

        -- Add validation for numeric fields
        if not tokenDenomination or type(tokenDenomination) ~= "number" then
            return SendFailure(m.From, "Invalid token denomination")
        end

        local fees = amount * 0.02 * tokenDenomination  -- Use exponent for denomination
        
        local fees = math.floor(fees)


        ao.send({
            Target = tokenId,
            Action = "Transfer",
            Quantity = tostring(fees),  -- Ensure integer
            Recipient = PROCESS_ID_AOS_STAKERS
        })

        local remainingAmount = amount * 0.979

        if not TaskTable[appId] then
            return SendFailure(m.From, "App doesn't exist")
        end

        local tasks = TaskTable[appId]
        
        if tasks.owner ~= userId then
            return SendFailure(m.From, "Authorization failed")
        end

        -- Initialize with proper numeric types
        tasks.tasks[taskId] = {
            createdTime = currentTime,
            status = "Pending",
            taskId = taskId,
            tasksAmount = remainingAmount,
            tokenId = tokenId,
            tokenDenomination = tokenDenomination,
            taskerCount = 0,  -- Initialize as number
            completedRate = {
                completeCount = 0,
                remainingTasks = 0
            },
            replies ={}
        }

        tasks.count = (tasks.count or 0) + 1
        tasks.countHistory[#tasks.countHistory + 1] = {
            count = tasks.count,
            time = currentTime
        }

        LogTransaction(userId, appId, "Tasks Creation", remainingAmount, currentTime, 200)
        SendSuccess(userId, taskId)
    end
)



Handlers.add(
    "FinalizeTask",
    Handlers.utils.hasMatchingTag("Action", "FinalizeTask"),
    function(m)
        local taskId = m.Tags.taskId
        local appId = m.Tags.appId
        local link = m.Tags.link
        local task = m.Tags.task
        local description = m.Tags.description
        local taskerCount = tonumber(m.Tags.taskerCount)  -- Convert to number
        local title = m.Tags.title
        local userId = m.From
        local currentTime = m.Timestamp

        print (" Finalize Timestamp" .. currentTime)

        -- Validate numeric taskerCount
        if not taskerCount or type(taskerCount) ~= "number" then
            return SendFailure(m.From, "Invalid tasker count")
        end

        if not TaskTable[appId].tasks[taskId] then
            return SendFailure(m.From, "Task not found")
        end

        if TaskTable[appId].owner ~= userId then
            return SendFailure(m.From, "Authorization failed")
        end

        local taskFound = TaskTable[appId].tasks[taskId]
        
        -- Ensure numeric types
        local amount = tonumber(taskFound.tasksAmount) 
        local amountPerTask = amount / taskerCount
        
        -- Update with proper numeric values
        taskFound.link = link
        taskFound.task = task
        taskFound.tasksAmount = amount
        taskFound.taskerCount = taskerCount  -- Now a number
        taskFound.status = "Ongoing"
        taskFound.description = description
        taskFound.amountPerTask = math.floor(amountPerTask * 100) / 100  -- Round to 2 decimals
        taskFound.title = title
        
        -- Initialize completedRate properly
        taskFound.completedRate = {
            completeCount = 0,
            remainingTasks = taskerCount  -- Use numeric value
        }

        LogTransaction(userId, appId, "Task Finalization", 0, currentTime, 100)
        SendSuccess(userId, "Task finalized: "..taskId)
    end
)


-- Handlers.add(
--     "FetchAppTask",
--     Handlers.utils.hasMatchingTag("Action", "FetchAppTask"),
--     function(m)
--         local appId = "TX4"

--          if not ValidateField(appId, "appId", m.From) then return end

--          print("validation 1 complete  AppId : " .. appId)
--         -- Ensure appId exists in ReviewsTable
--          if TaskTable[appId] == nil then
--              SendFailure(m.From , "App not Found.")
--             return
--         end

--         print("validation 2 complete  AppId : " .. json.encode(TaskTable[appId]))
--         -- Fetch the info
--         local tasks = TaskTable[appId].tasks

--         print("validation 3 complete : " .. json.encode(tasks))
--         SendSuccess(m.From , TaskTable[appId])
--     end
-- )

Handlers.add(
    "FetchAppTasks",
    Handlers.utils.hasMatchingTag("Action", "FetchAppTasks"),
    function(m)
        local appId = m.Tags.appId
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not TaskTable[appId] then return SendFailure(m.From, "App not Found.") end

        local response = Universal_sanitize(TaskTable[appId])
        SendSuccess(m.From, response.tasks)
    end
)

Handlers.add(
    "AddTaskReply",
    Handlers.utils.hasMatchingTag("Action", "AddTaskReply"),
    function(m)
        local appId = m.Tags.appId
        local taskId = m.Tags.taskId
        local username = m.Tags.username
        local url = m.Tags.url
        local profileUrl = m.Tags.profileUrl
        local providedRank = m.Tags.rank
        local user = m.From
        local currentTime = GetCurrentTime(m)
        local replyId = GenerateReplyId()

        -- Validate input fields
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(url, "url", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(taskId, "taskId", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end

        -- Check app existence
        if not TaskTable[appId] then
            return SendFailure(m.From, "App doesn't exist for specified AppId")
        end

        local app = TaskTable[appId]


        -- Verify task exists
        if not app.tasks[taskId] then
            return SendFailure(m.From, "Task doesn't exist in specified App")
        end

        local task = app.tasks[taskId]
        task.replies = task.replies or {}

        -- Enhanced duplicate check (NEW)
        for existingId, reply in pairs(task.replies) do
            -- Check both URL AND user to prevent duplicates
            if reply.user == user then
                LogTransaction(user, appId, "Duplicate user reply", 0, currentTime, -10)
                return SendFailure(m.From, "You've already submitted a reply to this task")
            end
            if reply.url == url then
                LogTransaction(user, appId, "Duplicate URL submission", 0, currentTime, -10)
                return SendFailure(m.From, "This URL has already been submitted")
            end
        end

        -- Get task amount safely
        local amount = task.amountPerTask

        local completedTasks = {
                completed = false,
                completedTime = currentTime,
                proof = url,
                amount = amount
            }

        -- Create new reply
        task.replies[replyId] = {
            replyId = replyId,
            user = user,
            url = url,
            status = "Pending",
            completedTasks = completedTasks,
            profileUrl = profileUrl,
            rank = DetermineUserRank(user, appId, providedRank),
            username = username,
            createdTime = currentTime
        }

        -- Update task counters
        task.completedRate = task.completedRate or { completeCount = 0, remainingTasks = task.taskerCount }
        task.completedRate.completeCount = (task.completedRate.completeCount or 0) + 1
        task.completedRate.remainingTasks = (task.completedRate.remainingTasks or task.taskerCount) - 1

        -- Log transaction
        LogTransaction(user, appId, "Completed Task", 0, currentTime, 3)

       local  sanitizedData = Universal_sanitize(TaskTable[appId])

       local replyData = sanitizedData.tasks[taskId].replies[replyId]
        SendSuccess(m.From, replyData)
    end
)

Handlers.add(
    "RewardTask",
    Handlers.utils.hasMatchingTag("Action", "RewardTask"),
    function(m)
        local appId = m.Tags.appId
        local taskId = m.Tags.taskId
        local replyId = m.Tags.replyId
        local currentTime = GetCurrentTime(m)

        -- Validate input fields
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end
        if not ValidateField(taskId, "taskId", m.From) then return end

        -- Check app existence
        if not TaskTable[appId] then
            return SendFailure(m.From, "App doesn't exist for specified AppId")
        end

        local app = TaskTable[appId]

        -- Validate permissions (FIXED)
        if app.owner ~= m.From and not app.mods[m.From] then
            return SendFailure(m.From, "Only owner/mods can reward tasks")
        end

        -- Verify task exists
        if not app.tasks[taskId] then
            return SendFailure(m.From, "Task doesn't exist in specified App")
        end

        local task = app.tasks[taskId]

        -- Get reply safely (FIXED PATH)
        local targetReply = task.replies and task.replies[replyId]
        if not targetReply then
            return SendFailure(m.From, "Reply doesn't exist for specified task")
        end

        -- Check completion status
        if targetReply.completedTasks.completed == true then
            return SendFailure(m.From, "Reward already sent to the user")
        end

        -- Validate task economics
        local amountPerTask = task.amountPerTask or 0
        local tokenId = task.tokenId or "nil"
        local tokenDenomination = tonumber(task.tokenDenomination) or 0

        if tokenId == "nil" or tokenDenomination <= 0 then
            return SendFailure(m.From, "Invalid token configuration")
        end

        -- Calculate base units
        local baseUnits = amountPerTask * tokenDenomination
        local recipient = targetReply.user

        -- Send tokens with error handling (NEW)
         ao.send({
            Target = tokenId,
            Action = "Transfer",
            Quantity = tostring(baseUnits),
            Recipient = recipient,
        })


        -- Update completion status (FIXED)
        targetReply.completedTasks = {
            completed = true,
            completedTime = currentTime,
            proof = targetReply.url,
            amount = amountPerTask,  -- Store display amount
        }

        -- Update counters safely (FIXED)
        task.completedRate = task.completedRate or {
            completeCount = 0,
            remainingTasks = task.taskerCount
        }
        task.completedRate.completeCount = (task.completedRate.completeCount or 0) + 1
        task.completedRate.remainingTasks = math.max(
            (task.taskerCount or 0) - task.completedRate.completeCount, 
            0
        )

        -- Log transactions properly (FIXED)
        LogTransaction(m.From, appId, "Rewarded User", amountPerTask, currentTime, 3)
        LogTransaction(recipient, appId, "Received Reward", amountPerTask, currentTime, 0)

        SendSuccess(m.From, "Successfully rewarded user "..recipient)
    end
)

Handlers.add(
    "AddModerator",
    Handlers.utils.hasMatchingTag("Action", "AddModerator"),
    function(m)

        local appId = m.Tags.appId
        local modId = m.Tags.modId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current createdTime
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(modId , "modId", m.From) then return end


         -- Ensure appId exists in TaskTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = TaskTable[appId]
        modlists.users[user] = { replyTask = true, time = currentTime }
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
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current createdTime
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(modId , "modId", m.From) then return end


         -- Ensure appId exists in TaskTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user then
            SendFailure(m.From, "Only the app owner can add moderator.")
        end


        local modlists = TaskTable[appId].mods
        
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

         -- Ensure appId exists in TaskTable
        if TaskTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if TaskTable[appId].owner ~= user or TaskTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can view modlists.")
        end


        local modlists =  TaskTable[appId].mods

        SendSuccess(user,modlists)
    end
)


Handlers.add(
    "TestSanitizer",
    Handlers.utils.hasMatchingTag("Action", "TestSanitizer"),
    function(m)
        
        local  Data = {val1 = 0.00001,val2 = 890.56,val3 = 57.4500, val4= 90.339999991}

        -- Check if the tasks exists
        local sanitizedTasks = Universal_sanitize(Data)
        
        print("Sanitized Tasks ".. json.encode(sanitizedTasks))     

        SendSuccess(m.From ,sanitizedTasks)

    end
)

Handlers.add(
    "FetchTaskInfo",
    Handlers.utils.hasMatchingTag("Action", "FetchTaskInfo"),
    function(m)
        local user = m.From
        local appId = m.Tags.appId
        local taskId = m.Tags.taskId

      
        if not ValidateField(taskId, "taskId", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end

        if TaskTable[appId].tasks[taskId]  == nil then
            SendFailure(m.From, "task does not exists for that AppId..")
            return
        end


        -- Check if the tasks exists
        local sanitizedTasks = Universal_sanitize(TaskTable[appId])
        
        local taskData =   sanitizedTasks.tasks[taskId]      

        SendSuccess(m.From ,taskData)

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
            Action = "TasksAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent tasks handler aosPoints table")
    end
)


Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)

        if m.From == ao.id then
             TaskTable = {}
            AosPoints =  {}
            Transactions = Transactions or {}
            TaskCounter = 0
            TransactionCounter = 0
            ReplyCounter = 0
            SendSuccess(m.From , "Succesfully deleted project")
        else
        SendFailure(m.From, "You do not have any transactions")
        end
    end
)

