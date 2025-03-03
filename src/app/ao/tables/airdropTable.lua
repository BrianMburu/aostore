local json = require("json")


-- This process details
PROCESS_NAME = "aos Airdrop_Table"
PROCESS_ID = "ow_4lNzwLheZht2vC0k53MlIi9Tfw57_871KvTKOOpY"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
airdropTable = airdropTable or {}
aosPoints  = aosPoints or {}
transactions = transactions or {}

-- counters variables
transactionCounter  = transactionCounter or 0
AidropCounter = AidropCounter or 0


-- Function to get the current time in milliseconds
function getCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end



-- Function to generate a unique transaction ID
function generateTransactionId()
    transactionCounter = transactionCounter + 1
    return "TX" .. tostring(transactionCounter)
end


-- Function to generate a unique transaction ID
function generateAirdropId()
    AidropCounter = AidropCounter + 1
    return "TX" .. tostring(AidropCounter)
end



Handlers.add(
    "AddAirdropTable",
    Handlers.utils.hasMatchingTag("Action", "AddAirdropTable"),
    function(m)
        local currentTime = getCurrentTime(m)
        local airdropId = generateAirdropId()
        local AppId = m.Tags.appId
        local user  = m.Tags.user
        local Appname = m.Tags.AppName
        
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
        
        if Appname == nil then
            ao.send({ Target = m.From, Data = "profileUrl is missing or empty." })
            return
        end
        
        
        -- Ensure global tables are initialized
        airdropTable = airdropTable or {}
        aosPoints = aosPoints or {}
        transactions = transactions or {}

        airdropTable[AppId] = {
             appId = AppId,
            status = false,
            airdrops = {
        [airdropId] = {
            airdropId = airdropId,
            Owner = user,
            appId = AppId,
            tokenId = ARS,
            amount = 5,
            timestamp = currentTime,
            appName = Appname ,
            status = "Pending", -- Possible statuses: "Pending", "Active", "Completed"
            airdropsReceivers = "reviewsTable", -- Define how recipients are selected
            startTime = currentTime,
            endTime = currentTime + 3600000,
            description = "Review and rate our project between today and 8th February and earn tokens",
            
            -- Tracks participants who qualify for the airdrop
            participants = { 
                [user] = { time = currentTime, status = "Eligible" } 
            },

            -- Tracks users who have already claimed their airdrop rewards
            claimedUsers = { 
                -- Example: [user] = { time = currentTime, amountClaimed = 5 }
            }
        }
    },
    count = 1,
    countHistory = { { time = currentTime, count = 1 } },
    users = { [user] = { time = currentTime } }
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

        airdropTable[#airdropTable + 1] = {
            airdropTable[AppId]
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
            amount = 0,
            points = currentPoints,
            timestamp = currentTime}
        -- Update statuses to true after creation
        airdropTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "AirdopRespons",
            Data = tostring(status)
        })
        print("Successfully Added Airdrop  table")
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
    "ClearAirdropTable",
    Handlers.utils.hasMatchingTag("Action", "ClearAirdropTable"),
    function(m)
        airdropTable = {}
    end
)