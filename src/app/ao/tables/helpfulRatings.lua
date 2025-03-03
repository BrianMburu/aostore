
local json = require("json")



-- This process details
PROCESS_NAME = "aos Helpful_Table"
PROCESS_ID = "bQVmkwCFW7K2hIcVslihAt4YjY1RIkEkg5tXpZDGbbw"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostore_main"
PROCESS_ID_MAIN = "QT_bqv-thVbp_uPFuotxpDu1FDpppXDs1aEre23HX_c"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
aosPoints = aosPoints or {}
transactions = transactions or {}
helpfulRatingsTable = helpfulRatingsTable or {}

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
    "AddHelpfulTableX",
    Handlers.utils.hasMatchingTag("Action", "AddHelpfulTableX"),
    function(m)
        local currentTime = getCurrentTime(m)
        local AppId = m.Tags.appId
        local user = m.From
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
        helpfulRatingsTable = helpfulRatingsTable or {}
        aosPoints = aosPoints or {}
        
        helpfulRatingsTable[AppId] = {
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

        helpfulRatingsTable[#helpfulRatingsTable + 1] = {
            helpfulRatingsTable[AppId]
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
        helpfulRatingsTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "HelpfulRespons",
            Data = tostring(status)
        })
        print("Successfully Added Helpful Rating table")
    end
)


Handlers.add(
    "AddHelpfulTableY",
    Handlers.utils.hasMatchingTag("Action", "AddHelpfulTableY"),
    function(m)
        local currentTime = getCurrentTime(m)
        local AppId = "TX50"
        local user = m.From
        local caller = m.From

        print("Here is the caller Process ID" .. caller)
        

        if user == nil then
            ao.send({ Target = m.From, Data = "user is missing or empty." })
            return
        end
        
        if AppId == nil then
            ao.send({ Target = m.From, Data = "appId is missing or empty." })
            return
        end
        
        -- Ensure global tables are initialized
        helpfulRatingsTable = helpfulRatingsTable or {}
        aosPoints = aosPoints or {}
        
        helpfulRatingsTable[AppId] = {
            Owner = user,
            appId = AppId,
            status = false,
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { time = currentTime }
            }
        }

        -- Create the aosPoints table for this AppId
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

        helpfulRatingsTable[#helpfulRatingsTable + 1] = {
            helpfulRatingsTable[AppId]
        }

        aosPoints[#aosPoints + 1] = {
            aosPoints[AppId]
        }
        -- Update statuses to true after creation
        helpfulRatingsTable[AppId].status = true
        aosPoints[AppId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "HelpfulRespons",
            Data = tostring(status)
        })
        print("Successfully Added Helpful table")
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
    "HelpfulRatingApp",
    Handlers.utils.hasMatchingTag("Action", "HelpfulRatingApp"),
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

        -- Check if the user has already marked the rating as helpful
        if appHData.users[user] then
            ao.send({ Target = m.From, Data = "You have already marked this rating as helpful." })
            return
        end

        -- Check if the user has previously marked the app as unhelpful
        if appUhData.users[user] then
            -- Remove the user from the unhelpful users table
            appUhData.users[user] = nil
            -- Decrement the unhelpful count
            appUhData.count = appUhData.count - 1

            -- Log the count change in unhelpful count history
            table.insert(appUhData.countHistory, { time = currentTime, count = appUhData.count })

            -- Deduct points for switching ratings
            local points = -200
            
            arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
            arsPoints[user].points = arsPoints[user].points + points
            local currentPoints = arsPoints[user].points
            local transactionId = generateTransactionId()
            table.insert(transactions, {
                user = user,
                transactionid = transactionId,
                type = "Previously Rated Unhelpful.",
                amount = 0,
                points = currentPoints,
                timestamp = currentTime
            })
        end

        -- Add the user to the helpful users table
        appHData.users[user] = { voted = true, time = currentTime }
        -- Increment the helpful count
        appHData.count = appHData.count + 1
        -- Log the count change in helpful count history
        table.insert(appHData.countHistory, { time = currentTime, count = appHData.count })

        -- Reward points for marking an app as helpful
        local points = 100
        arsPoints[user] = arsPoints[user] or { user = user, points = 0 }
        arsPoints[user].points = arsPoints[user].points + points
        local currentPoints = arsPoints[user].points
        local amount = 2 *1000000000000 -- Reward tokens for helpful rating
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
            type = "Helpful Rating.",
            amount = amount,
            timestamp = currentTime
        })
        -- Debugging
        print("Helpful vote added successfully!")
        ao.send({ Target = m.From, Data = "You have successfully marked this app as helpful." })
    end
)

Handlers.add(
    "ClearHelpfulTable",
    Handlers.utils.hasMatchingTag("Action", "ClearHelpfulTable"),
    function(m)
        helpfulRatingsTable = {}
    end
)

