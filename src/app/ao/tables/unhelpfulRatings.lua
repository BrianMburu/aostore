

-- This process details
PROCESS_NAME = "aos UnHelpful_Table"
PROCESS_ID = "f4alCYxrBPDMOmTIBfHB43m1snkZSKdPqpr0Tr93t-U"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostore_main"
PROCESS_ID_MAIN = "QT_bqv-thVbp_uPFuotxpDu1FDpppXDs1aEre23HX_c"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
aosPoints = aosPoints or {}
transactions = transactions or {}
unHelpfulRatingsTable = unHelpfulRatingsTable or {}

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
    "AddUnhelpfulTable",
    Handlers.utils.hasMatchingTag("Action", "AddUnhelpfulTable"),
    function(m)
        local currentTime = getCurrentTime(m)
        local AppId = m.Tags.appId
        local user = m.From
        local caller = m.From
        local Rank = m.Tags.rank
        
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
        unHelpfulRatingsTable = unHelpfulRatingsTable or {}
        aosPoints = aosPoints or {}
        
        unHelpfulRatingsTable[AppId] = {
            appId = AppId,
            status = false,
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { rated = true , time = currentTime }
            }
        }
            
        -- Create the aosPoints table for this AppId
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

        unHelpfulRatingsTable[#unHelpfulRatingsTable + 1] = {
            unHelpfulRatingsTable[AppId]
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
        unHelpfulRatingsTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "UnHelpfulRespons",
            Data = tostring(status)
        })
        print("Successfully Added UnHelpful table")
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



-- Add Helpful Rating Handler
Handlers.add(
    "UnhelpfulRatingApp",
    Handlers.utils.hasMatchingTag("Action", "UnhelpfulRatingApp"),
    function(m)

        -- Check if all required m.Tags are present
        local requiredTags = { "AppId" }

        for _, tag in ipairs(requiredTags) do
            if m.Tags[tag] == nil then
                print("Error: " .. tag .. " is nil.")
                ao.send({ Target = m.From, Data = tag .. " is missing or empty." })
                return
            end
        end

        local AppId = m.Tags.AppId
        local user = m.From
        local currentTime = getCurrentTime(m)

        -- Get the app data for helpful and unhelpful ratings
        local appHData = helpfulRatingsTable[AppId]
        local appUhData = unHelpfulRatingsTable[AppId]

        -- Check if the user has already marked the rating as unhelpful
        if appUhData.users[user] then
            ao.send({ Target = m.From, Data = "You have already marked this rating as helpful." })
            return
        end

        -- Check if the user has previously marked the app as helpful
        if appHData.users[user] then
            -- Remove the user from the helpful users table
            appHData.users[user] = nil
            -- Decrement the helpful count
            appHData.count = appHData.count - 1

            -- Log the count change in helpful count history
            table.insert(appHData.countHistory, { time = currentTime, count = appHData.count })

            -- Deduct points for switching ratings
            local points = -200
           
            arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
            arsPoints[user].points = arsPoints[user].points + points
            local currentPoints = arsPoints[user].points
            local transactionId = generateTransactionId()
            table.insert(transactions, {
                user = user,
                transactionid = transactionId,
                type = "Previously Rated Helpful.",
                amount = 0,
                points = currentPoints,
                timestamp = currentTime
            })
        end

        -- Add the user to the unhelpful users table
        appUhData.users[user] = { voted = true, time = currentTime }
        -- Increment the unhelpful count
        appUhData.count = appUhData.count + 1
        -- Log the count change in unhelpful count history
        table.insert(appUhData.countHistory, { time = currentTime, count = appUhData.count })

        -- Deduct points for marking an app as unhelpful
        local points = 100
        -- Ensure arsPoints[user] is initialized
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        -- Update points
        arsPoints[user].points = arsPoints[user].points + points
        -- Safely access points
        local currentPoints = arsPoints[user].points
        local amount = 0.5 * 1000000000000-- Deduction of tokens for unhelpful rating
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
            type = "UnHelpful Rating.",
            amount = amount,
            points = currentPoints,
            timestamp = currentTime
        })
        -- Debugging
        print("Unhelpful vote added successfully!")
        ao.send({ Target = m.From, Data = "You have successfully marked this app as unhelpful." })
    end
)

Handlers.add(
    "ClearHelpfulTable",
    Handlers.utils.hasMatchingTag("Action", "ClearHelpfulTable"),
    function(m)
        unHelpfulRatingsTable = {}
    end
)