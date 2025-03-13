
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
        unHelpfulRatingsTable = unHelpfulRatingsTable or {}
        aosPoints = aosPoints or {}
        
        helpfulRatingsTable[AppId] = {
            appId = AppId,
            Owner = user,
            status = false,
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { rated = true , time = currentTime }
            }
        }

        unHelpfulRatingsTable[AppId] = {
            appId = AppId,
            Owner = user,
            status = false,
            count = 0,
            countHistory = { { time = currentTime, count = 0 } },
            users = {
                [user] = { rated = false , time = currentTime }
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
    "DeleteApp",
    Handlers.utils.hasMatchingTag("Action", "DeleteApp"),
    function(m)

        local appId = m.Tags.AppId
        local Owner = m.Tags.Owner
        local caller = m.From

         -- Check if PROCESS_ID called this handler
        if ARS ~= caller then
            ao.send({ Target = m.From, Data = "Only the main processID can call this handler" })
            return
        end

        -- Check if the user making the request is the current owner
        if helpfulRatingsTable[appId].Owner ~= Owner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        -- Check if the user making the request is the current owner
        if unHelpfulRatingsTable[appId].Owner ~= Owner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        if appId == nil then
            ao.send({ Target = m.From, Data = "appId is missing or empty." })
            return
        end

        if Owner == nil then
            ao.send({ Target = m.From, Data = "Owner is missing or empty." })
            return
        end

        helpfulRatingsTable[appId] = nil
        unHelpfulRatingsTable[appId] = nil
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
            local points = -5
            
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
        local points = -5
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
    "GetHelpfulCount",
    Handlers.utils.hasMatchingTag("Action", "GetHelpfulCount"),
    function(m)
        local AppId = m.Tags.AppId
        if not AppId then
            ao.send({ Target = m.From, Data = "AppId is missing." })
            return
        end

        if not helpfulRatingsTable[AppId] then
            ao.send({ Target = m.From, Data = "No reviews found for AppId: " .. AppId })
            return
        end

        local count = helpfulRatingsTable[AppId].count or 0
        local response = { AppId = AppId, reviewCount = count }
        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)


Handlers.add(
    "GetUnHelpfulCount",
    Handlers.utils.hasMatchingTag("Action", "GetUnHelpfulCount"),
    function(m)
        local AppId = m.Tags.AppId
        if not AppId then
            ao.send({ Target = m.From, Data = "AppId is missing." })
            return
        end

        if not unHelpfulRatingsTable[AppId] then
            ao.send({ Target = m.From, Data = "No reviews found for AppId: " .. AppId })
            return
        end

        local count = unHelpfulRatingsTable[AppId].count or 0
        local response = { AppId = AppId, reviewCount = count }
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
    "ClearHelpfulTable",
    Handlers.utils.hasMatchingTag("Action", "ClearHelpfulTable"),
    function(m)
        helpfulRatingsTable = {}
    end
)



Handlers.add(
    "ClearUnHelpfulTable",
    Handlers.utils.hasMatchingTag("Action", "ClearUnHelpfulTable"),
    function(m)
        unHelpfulRatingsTable = {}
    end
)