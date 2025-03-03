
local json = require("json")


-- This process details
PROCESS_NAME = "aos Flag_Table"
PROCESS_ID = "BpGlNnMA09jM-Sfh6Jldswhp5AnGTCST4MxG2Dk-ABo"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostore_main"
PROCESS_ID_MAIN = "QT_bqv-thVbp_uPFuotxpDu1FDpppXDs1aEre23HX_c"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
aosPoints = aosPoints or {}
transactions = transactions or {}
flagTable = flagTable or {}

-- counters variables

transactionCounter  = transactionCounter or 0


-- Function to get the current time in milliseconds
function getCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end

-- Function to generate a unique transaction ID
function generateTransactionId()
    transactionCounter = transactionCounter + 1
    return "TX" .. tostring(transactionCounter)
end




Handlers.add(
    "AddFlagTableX",
    Handlers.utils.hasMatchingTag("Action", "AddFlagTableX"),
    function(m)
        local currentTime = getCurrentTime(m)
        local AppId = m.Tags.appId
        local user  = m.Tags.user
        local caller = m.From

        print("Here is the caller Process ID" .. caller)
        

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


        
        -- Ensure global tables are initialized
        flagTable = flagTable or {}
        aosPoints = aosPoints or {}
        
        flagTable[AppId] = {
            appId = AppId,
            status = false,
            count = 0,
            countHistory = { { time = currentTime, count = 0 } },
            users = {
                [user] = { flagged = false, time = currentTime }
            }
        }

        -- Create the aosPoints table for this AppId
        aosPoints[AppId] = {
            appId = AppId,
            status = false,
            TotalpointsApp = 0,
            count = 0,
            countHistory = { { time = currentTime, count = 0 } },
            users = {
                [user] = { time = currentTime , points = 0 }
            }
        }

        flagTable[#flagTable + 1] = {
            flagTable[AppId]
        }

        aosPoints[#aosPoints + 1] = {
            aosPoints[AppId]
        }
        -- Update statuses to true after creation
        flagTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "FlagRespons",
            Data = tostring(status)
        })
        print("Successfully Added Flag table")
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
    "ClearFlagTable",
    Handlers.utils.hasMatchingTag("Action", "ClearFlagTable"),
    function(m)
        flagTable = {}
    end
)