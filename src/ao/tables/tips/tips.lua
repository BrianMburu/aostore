local json = require("json")


-- This process details
PROCESS_NAME = "aos TipsTable"
PROCESS_ID = "LkCdB2PkYRl4zTChv1DiTtiLqr5Qpu0cJ6V6mvHUnOo"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"



AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"

-- tables 
Tokens = Tokens or {}
AosPoints = AosPoints or {}
Transactions = Transactions or {}
TransactionCounter = TransactionCounter or 0





Tips = Tips  or {}
TipsTransactions = TipsTransactions or {}
TipsTransactionCounter = TipsTransactionCounter or 0


-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end

-- Function to generate a unique transaction ID
function GenerateTipTransactionId()
    TipsTransactionCounter = TipsTransactionCounter + 1
    return "TX" .. tostring(TipsTransactionCounter)
end

function TableToArray(tbl)
    local arr = {}
    for _, v in pairs(tbl) do
        table.insert(arr, v)
    end
    return arr
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
            timestamp = currentTime
        }
end


-- Helper function to log  Tip transactions
function LogTipsTransaction(user, appId, transactionType, amount, currentTime,tipped , appName,logo)
    local transactionId = GenerateTipTransactionId()
    TipsTransactions[#TipsTransactions + 1] = {
            user = user,
            transactionid = transactionId,
            transactionType = transactionType,
            amount = amount,
            tipped = tipped,
            timestamp = currentTime,
            appName = appName,
            logo = logo
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


-- Function to get the current time in milliseconds
function GetCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end


function GetBalance(userId, tokenProcessId)
    local balance = 0

    ao.send({
        Target = tokenProcessId,
        Tags = {
            Action = "Balance",
            Target = userId
        }
    })

    -- Debug log to verify the latest Inbox entry
    if Inbox[#Inbox] then
        print("Latest Inbox Entry: ", Inbox[#Inbox].Data, "From Token Process ID:", tokenProcessId)
        balance = (tonumber(Inbox[#Inbox].Data) or 0)
    else
        print("No data in Inbox for Token Process ID:", tokenProcessId)
    end
    return balance
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

Handlers.add(
    "AddTipsTable",
    Handlers.utils.hasMatchingTag("Action", "AddTipsTable"),
    function(m)
        local currentTime = m.Tags.currentTime
        local appId = m.Tags.appId
        local appName = m.Tags.appName
        local caller = m.From
        local user = m.Tags.user
        local logo = m.Tags.logo
        local tokenId = m.Tags.tokenId
        local tokenName = m.Tags.tokenName
        local tokenTicker = m.Tags.ticker
        local tokenDenomination = m.Tags.denomination

         if ARS ~= caller then
           SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end

       -- if not ValidateField(appName, "appName", m.From) then return end
        --if not ValidateField(tokenId, "tokenId", m.From) then return end
       -- if not ValidateField(tokenName, "tokenName", m.From) then return end
      --  if not ValidateField(tokenDenomination, "tokenDenomination", m.From) then return end
       -- if not ValidateField(tokenTicker, "tokenTicker", m.From) then return end
        --if not ValidateField(logo, "logo", m.From) then return end
        --if not ValidateField(user, "user", m.From) then return end


        -- Ensure global tables are initialized
        Tokens = Tokens or {}
        AosPoints = AosPoints or {}
        Transactions = Transactions or {}

        Tokens[appId] ={
            owner = user,
            appName = appName,
            logo = logo,
            tokenDenomination =  tokenDenomination ,
            tokenTicker =  tokenTicker ,
            tokenName = tokenName,
            tokenId = tokenId,
            tokenCount = 0
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

        Tokens[#Tokens + 1] = {
            Tokens[appId]
        }

        AosPoints[#AosPoints + 1] = {
            AosPoints[appId]
        }

        local transactionType = "Project Creation."
        local amount = 0
        local points = 5
        LogTransaction(user, appId, transactionType, amount, currentTime,points)
        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "TipsRespons",
            Data = tostring(status)
        })
        print("Successfully Added Tips  table")
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
        
        -- Ensure appId exists in Tokens
        if Tokens[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        -- Check if the user making the request is the current owner
        if Tokens[appId].owner ~= owner then
            SendFailure(m.From, "You are not the Owner of the App.")
            return
        end
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        local transactionType = "Deleted Project."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        Tokens[appId] = nil
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
        
        -- Ensure appId exists in Tokens
        if Tokens[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end

        -- Check if the user making the request is the current owner
        if Tokens[appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        Tokens[appId].owner = newOwner
        Tokens[appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
    end
)


Handlers.add(
    "AddTokenDetails",
    Handlers.utils.hasMatchingTag("Action", "AddTokenDetails"),
    function(m)
        local appId = m.Tags.appId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the current timestamp
        local tokenId = m.Tags.tokenId
        local tokenName = m.Tags.tokenName
        local tokenTicker = m.Tags.tokenTicker
        local tokenDenomination = m.Tags.tokenDenomination
        local logo = m.Tags.logo

        if not ValidateField(tokenId, "tokenId", m.From) then return end
        if not ValidateField(tokenName, "tokenName", m.From) then return end
        if not ValidateField(tokenDenomination, "tokenDenomination", m.From) then return end
        if not ValidateField(tokenTicker, "tokenTicker", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(logo, "logo", m.From) then return end
  

        if not Tokens[appId] then
            SendFailure(m.From, "App not found...")
            return
        end
        
         if not Tokens[appId].owner ~= user then
           SendFailure(m.From, "Only the owner can Update this tokens details.")
        end

        
        local report =  Tokens[appId]

        report.tokenId = tokenId
        report.tokenName = tokenName
        report.tokenDenomination = tokenDenomination
        report.tokenTicker = tokenTicker
        report.tokenCount = report.tokenCount + 1
        report.logo = logo


        local transactionType = "Added Token information Succesfully."
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        local reportInfo =  Tokens[appId]
        SendSuccess(m.From , reportInfo)   
    end
)


Handlers.add(
    "GetTokenDetails",
    Handlers.utils.hasMatchingTag("Action", "GetTokenDetails"),
    function(m)
        local appId = m.Tags.appId
        local user = m.From
    
        if not ValidateField(appId, "appId", m.From) then return end
  
        if not Tokens[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if Tokens[appId].tokenId == nil then
            SendSuccess(user, {})
            return
        end
        
          if Tokens[appId].tokenName == nil then
             SendSuccess(user , {})   
            return
        end

        local reportInfo =  Tokens[appId]
        SendSuccess(user , reportInfo)   
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
    "GetTokenBalance",
    Handlers.utils.hasMatchingTag("Action", "GetTokenBalance"),
    function(m)
        -- Extract parameters
        local appId = m.Tags.appId
        local userId = m.From

        -- Validate required fields
        if not ValidateField(appId, "appId", userId) then return end

        -- Check if appId exists in Tokens
        local tokenData = Tokens[appId]
        if  tokenData == nil then
            return SendFailure(userId, "Invalid appId: Token data not found")
        end

        -- Extract token denomination and process ID
        local tokenDenomination = tonumber(tokenData.tokenDenomination)
        local tokenProcessId = tokenData.tokenProcessId

        -- Validate tokenDenomination
        if type(tokenDenomination) ~= "number" or tokenDenomination < 0 then
            return SendFailure(userId, "Invalid token denomination")
        end

        -- Fetch raw balance from the token process
        local rawBalance = GetBalance(userId, tokenProcessId)

        if rawBalance == nil then
            return SendFailure(userId, "Failed to fetch balance")
        end

        -- Convert raw balance to human-readable format
        local formattedBalance = rawBalance / (10 ^ tokenDenomination)

        -- Send success response with the formatted balance
        SendSuccess(userId, string.format("Your balance is %.6f tokens", formattedBalance))
    end
)



Handlers.add(
    "FetchTokensX",
    Handlers.utils.hasMatchingTag("Action", "FetchTokensX"),
    function(m)
        if Tokens == nil then
            return SendFailure(m.From, "Apps are nil")
        end

        local filteredTokens = {}
        for appId, app in pairs(Tokens) do
            -- Check if all required fields exist and are not "nil"
            if app.tokenDenomination ~= "nil" and
               app.tokenId ~= "nil" and
                app.appName ~= "nil" and
                app.appName ~= "nil" and
               app.logo ~= "nil" and
               app.tokenTicker ~= "nil" then
               
                filteredTokens[appId] = {
                    tokenDenomination = app.tokenDenomination,
                    tokenId = app.tokenId,
                    appName = app.appName,
                    logo = app.logo,
                    tokenTicker = app.tokenTicker
                }
            end
        end
       
        SendSuccess(m.From, filteredTokens)
    end
)


Handlers.add(
    "TipsEarned",
    Handlers.utils.hasMatchingTag("Action", "TipsEarned"),
    function(m)
        local appId = m.Tags.appId
        local receiverId = m.Tags.receiverId
        local tipId = m.Tags.tipId
        local user = m.From
        local amount = tonumber(m.Tags.amount)  -- Convert to number
        local currentTime = GetCurrentTime(m)

        -- Validate required fields
        if not ValidateField(appId, "appId", user) then return end
        if not ValidateField(receiverId, "receiverId", user) then return end
        if not ValidateField(amount, "amount", user) then return end  
        if not ValidateField(tipId, "tipId", user) then return end  

        -- Check if appId exists in Tokens
        local tokenData = Tokens[appId]
        if not tokenData then
            return SendFailure(user, "Invalid appId: Token data not found")
        end

        -- Initialize TipsTransactions structure
        TipsTransactions = TipsTransactions or {}
        
        -- Initialize sender's entry
        TipsTransactions[user] = TipsTransactions[user] or {}
        TipsTransactions[user][appId] = TipsTransactions[user][appId] or {}
        TipsTransactions[user][appId][tipId] = TipsTransactions[user][appId][tipId] or { tipsHistory = {} }

        
        local logo = tokenData.logo
        -- Add sender's tip history
        local senderEntry = TipsTransactions[user][appId][tipId].tipsHistory
        senderEntry[#senderEntry + 1] = {
            user = user,
            transactionId = GenerateTipTransactionId(),
            transactionType = "Tips Sent",
            amount = amount,
            tipped = true,
            timestamp = currentTime,
            appName = tokenData.appName,
            logo = logo
        }

        -- Initialize receiver's entry
        TipsTransactions[receiverId] = TipsTransactions[receiverId] or {}
        TipsTransactions[receiverId][appId] = TipsTransactions[receiverId][appId] or {}
        TipsTransactions[receiverId][appId][tipId] = TipsTransactions[receiverId][appId][tipId] or { tipsHistory = {} }

       
        local logo = tokenData.logo
        -- Add receiver's tip history
        local receiverEntry = TipsTransactions[receiverId][appId][tipId].tipsHistory
        receiverEntry[#receiverEntry + 1] = {
            user = receiverId,
            transactionId = GenerateTipTransactionId(),
            transactionType = "Tips Received",
            amount = amount,
            tipped = false,
            timestamp = currentTime,
            appName = tokenData.appName,
            logo = logo
        }

        SendSuccess(user, "Successfully Tipped")
    end
)




Handlers.add(
    "GetCommentTips",
    Handlers.utils.hasMatchingTag("Action", "GetCommentTips"),
    function(m)
        local user = m.Tags.user
        local userId = m.From
        local appId = m.Tags.appId
        local tipId = m.Tags.tipId

        if not ValidateField(appId, "appId", userId) then return end
        if not ValidateField(user, "user", userId) then return end  
        if not ValidateField(tipId, "tipId", userId) then return end  


        -- Initialize tables safely
        TipsTransactions = TipsTransactions or {}
        TipsTransactions[user] = TipsTransactions[user] or {}
        TipsTransactions[user][appId] = TipsTransactions[user][appId] or {}
        TipsTransactions[user][appId][tipId] = TipsTransactions[user][appId][tipId] or { tipsHistory = {} }

        -- Safely get tips history
        local tipsData = TipsTransactions[user][appId][tipId].tipsHistory or {}

        local receivedTips = {}
        for _, tip in ipairs(tipsData) do
            if tip.tipped == false then
                -- Normalize field names and ensure all fields exist
                table.insert(receivedTips, {
                    transactionId = tip.transactionId or tip.transactionid,
                    amount = tonumber(tip.amount),
                    timestamp = tip.timestamp,
                    logo = tip.logo,
                    appName = tip.appName,
                    user = tip.user,
                    tipped = tip.tipped 
                })
            end
        end

        SendSuccess(m.From, tipsData)
    end
)

Handlers.add(
    "GetUserTips",
    Handlers.utils.hasMatchingTag("Action", "GetUserTips"),
    function(m)
        local user = m.From

        -- Safely initialize data structure
        TipsTransactions = TipsTransactions or {}
        TipsTransactions[user] = TipsTransactions[user] or {}


        -- Recursively check transaction structure
        local function validateTransactions(data)
            if type(data) ~= "table" then return {} end
            local validData = {}
            for appId, appData in pairs(data) do
                validData[appId] = {}
                for tipId, tipData in pairs(appData) do
                    validData[appId][tipId] = {
                        tipsHistory = tipData.tipsHistory or {}
                    }
                end
            end
            return validData
        end

        local userData = validateTransactions(TipsTransactions[user])

        SendSuccess(m.From, userData)
    end
)

Handlers.add(
    "GetUserTipsStatistics",
    Handlers.utils.hasMatchingTag("Action", "GetUserTipsStatistics"),
    function(m)
        local userId = m.Tags.user

        if not TipsTransactions or #TipsTransactions == 0 then
            return SendFailure(m.From, "Transactions table not found.")
        end

        local userStatistics = {
            totalEarnings = 0,
            tokens = {} -- Grouped by appName
        }

        for _, transaction in pairs(TipsTransactions) do
            -- Filter for received tips (tipped = false) and matching user
            if transaction.user == userId and transaction.tipped == false then
                -- Convert amount to number
                local amount = tonumber(transaction.amount) or 0
                local appName = transaction.appName
                local logo = transaction.logo

                -- Initialize token entry
                if not userStatistics.tokens[appName] then
                    userStatistics.tokens[appName] = {
                        appName = appName,
                        logo = logo,
                        totalEarnings = 0,
                        transactions = {}
                    }
                end

                -- Add transaction details
                local tokenEntry = userStatistics.tokens[appName]
                table.insert(tokenEntry.transactions, {
                    amount = amount,
                    time = transaction.timestamp,
                    transactionId = transaction.transactionid
                })

                -- Update totals
                tokenEntry.totalEarnings = tokenEntry.totalEarnings + amount
                userStatistics.totalEarnings = userStatistics.totalEarnings + amount
            end
        end

        -- Check if any transactions were found
        if userStatistics.totalEarnings == 0 then
            return SendFailure(m.From, "No received tips found for this user.")
        end

        -- Convert tokens table to array for cleaner output
        userStatistics.tokens = TableToArray(userStatistics.tokens)

        SendSuccess(m.From, userStatistics)
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
            Action = "TipsRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent tips handler aosPoints table")
    end
)

Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)

        if m.From == ao.id then
           Tokens = {}
            Tips = {}
            AosPoints =  {}
            Transactions = {}
            TipsTransactions ={}
            TipsTransactionCounter = 0
            TransactionCounter = 0
            ReplyCounter = 0
            SendSuccess(m.From , "Succesfully deleted project")
        else
        SendFailure(m.From, "You do not have any transactions")
        end
    end
)

