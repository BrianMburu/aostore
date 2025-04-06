local json = require("json")
local math = require("math")



-- AOSPOINTS process details.
PROCESS_NAME = "aos AosPoints"
PROCESS_ID_ = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"


-- AOS Token process details.
PROCESS_NAME = "aos Aostore_Token"
PROCESS_ID_AOS_TOKEN = "u2-XxndlJvyjDXU1uurYD8CTf3kehwDGEuSmTOyJwrU"


AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"

-- Main  process details.
PROCESS_NAME = "aos aostoreP"
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- Reviews Table process
PROCESS_NAME_REVIEW_TABLE = "aos Reviews_Table"
PROCESS_ID_REVIEW_TABLE = "-E8bZaG3KJMNqwCCcIqFKTVzqNZgXxqX9Q32I_M3-Wo"


-- Bug Reports Table process
PROCESS_NAME_BUG_REPORT_TABLE = "aos Bug_Report_Table"
PROCESS_ID_BUG_REPORT_TABLE  = "x_CruGONBzwAOJoiTJ5jSddG65vMpRw9uMj9UiCWT5g"



-- Helpful Table process
PROCESS_NAME_HELPFUL_TABLE = "aos Helpful_Table"
PROCESS_ID_HELPFUL_TABLE = "bQVmkwCFW7K2hIcVslihAt4YjY1RIkEkg5tXpZDGbbw"


-- DevForum Table process
PROCESS_NAME_DEV_FORUM_TABLE = "aos DevForumTable"
PROCESS_ID_DEV_FORUM_TABLE = "xs_gSLAAdqPYPRhHrNmdyktmgiJBExWycxNahLKaPy4"


-- Feature Requests details
PROCESS_NAME_FEATURE_REQUEST_TABLE = "aos featureRequestsTable"
PROCESS_ID_FEATURE_REQUEST_TABLE = "zxAZKgdrL8-ykqW-iJDkBEXJv812f7CZFjsazDKdehw"

-- This flag Table details
PROCESS_NAME_FLAG_TABLE = "aos Flag_Table"
PROCESS_ID_FLAG_TABLE = "BpGlNnMA09jM-Sfh6Jldswhp5AnGTCST4MxG2Dk-ABo"



-- Favorites process details
PROCESS_NAME_FAVORITES_TABLE = "aos Favorites_Table"
PROCESS_ID_FAVORITES_TABLE  = "2aXLWDFCbnxxBb2OyLmLlQHwPnrpN8dDZtB9Y9aEdOE"

-- Airdrops process details
PROCESS_NAME = "aos Airdrops_Table"
PROCESS_ID_AIRDROP_TABLE = "XkAtx1XJse3MMv4MrT5aRQbBu7_i-gTOE7kNmZj6Z8o"

-- Tips  process details
PROCESS_NAME = "aos TipsTable"
PROCESS_ID_TIPS_TABLE = "LkCdB2PkYRl4zTChv1DiTtiLqr5Qpu0cJ6V6mvHUnOo"


-- Tasks table  process details
PROCESS_NAME = "aos Tasks_Table"
PROCESS_ID_TASKS_TABLE = "a_YRsw_22Dw5yPdQCUmVFAeI8J3OUsCGc_z0KrtEvNg"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- tables 
Apps = Apps or {}

-- AosPoints Tables.

AosPointsMain = AosPointsMain or {}
AosPointsAirdrops = AosPointsAirdrops or {}
AosPointsBugReports = AosPointsBugReports or {}
AosPointsDevForum = AosPointsDevForum or {}
AosPointsFavorites = AosPointsFavorites or {}
AosPointsFeatures = AosPointsFeatures or {}
AosPointsFlags = AosPointsFlags or {}
AosPointsHelpful = AosPointsHelpful or {}
AosPointsTips = AosPointsTips or {}
AosPointsReviews = AosPointsReviews or {}
AosPointsTasks = AosPointsTasks or {}


Transactions  = Transactions or {}

Rankings = Rankings or {}

AosPointsBalance   = AosPointsBalance or {}


AosPoints = AosPoints or {}
-- Counters variables 
AppCounter  = AppCounter or 0
TransactionCounter = TransactionCounter or 0
MessageCounter  = MessageCounter or 0


-- Callback Variables
FetchmainaosCallback = nil
FetchreviewsCallback = nil
FetchhelpfulCallback = nil
FetchbugreportsCallback = nil
FetchdevforumCallback  = nil
FetchfeaturetableCallback = nil
FetchflagtableCallback  = nil
FetchunhelpfullCallback = nil
FetchfavoritesCallback = nil
FetchairdropsCallback = nil
FetchtipsCallback  = nil


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


-- Global Transfer Function
function Transfer(tokenId, quantity, recipient)
    -- Validate inputs
    assert(type(tokenId) == "string" and tokenId ~= "", "Invalid token ID")
    assert(type(recipient) == "string" and recipient ~= "", "Invalid recipient")
    assert(type(quantity) == "number" and quantity > 0, "Quantity must be positive number")

    -- Convert to integer if needed
    local amount = math.floor(quantity)
    
    -- Execute transfer
    ao.send({
        Target = tokenId,
        Action = "Transfer",
        Quantity = tostring(amount),
        Recipient = recipient,
    })

    return true
end



-- Function to generate a unique App ID
function GenerateAppId()
    AppCounter = AppCounter + 1
    return "TX" .. tostring(AppCounter)
end




-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
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
            transactionid = transactionId,
            transactionType = transactionType,
            amount = amount,
            points = currentPoints,
            timestamp = currentTime
        }
end


function AddMainAosPoints( callback)
    ao.send({
        Target = PROCESS_ID_MAIN,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchmainaosCallback = callback
end




function AddAosPointsReviews( callback)
    ao.send({
        Target = PROCESS_ID_REVIEW_TABLE,
        Tags = {
            { name = "Action",     value = "GetAosPointsTable" }
        }
    })
    -- Save the callback to be called later
    FetchreviewsCallback = callback
end


function AddAosPointsHelpful(callback)
    ao.send({
        Target = PROCESS_ID,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
     -- Save the callback to be called later
    FetchhelpfulCallback = callback
end


function AddAosPointsBugReport( callback)
    ao.send({
        Target = PROCESS_ID_BUG_REPORT_TABLE,
        Tags = {
            { name = "Action",   value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchbugreportsCallback = callback
end


function AddAosPointsDevForum( callback)
    ao.send({
        Target = PROCESS_ID_DEV_FORUM_TABLE,
        Tags = {
            { name = "Action",     value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchdevforumCallback = callback
end



function AddAosPointsFeatureRequest( callback)
    ao.send({
        Target = PROCESS_ID_FEATURE_REQUEST_TABLE,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchfeaturetableCallback = callback
end


function AddAosPointsFlagTable( callback)
    ao.send({
        Target = PROCESS_ID_FLAG_TABLE,
        Tags = {
            { name = "Action", value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchflagtableCallback = callback
end


function AddAosPointsFavorite(callback)
    ao.send({
        Target = PROCESS_ID_FAVORITES_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },}
    })
    -- Save the callback to be called later
    FetchfavoritesCallback = callback
end



function AddAosPointsAirdrop( callback)
    ao.send({
        Target = PROCESS_ID_AIRDROP_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchairdropsCallback = callback
end


function AddAosPointsTips( callback)
    ao.send({
        Target = PROCESS_ID_TIPS_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchtipsCallback = callback
end

function AddAosPointsTasks( callback)
    ao.send({
        Target = PROCESS_ID_TASKS_TABLE,
        Tags = {
            { name = "Action",  value = "GetAosPointsTable" },
        }
    })
    -- Save the callback to be called later
    FetchtipsCallback = callback
end


-- In ReviewsResponse handler:
Handlers.add(
  "MainAosRespons",
  Handlers.utils.hasMatchingTag("Action", "MainAosRespons"),
    function(m)

    if m.From == PROCESS_ID_MAIN then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosMainPoints Response:", xData)
      AosPointsMain = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)



Handlers.add(
  "ReviewsAosRespons",
  Handlers.utils.hasMatchingTag("Action", "ReviewsAosRespons"),
  function(m)

    if m.From == PROCESS_ID_REVIEW_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Reviews response.")
      return
      end
      print("Updated Rviews Response:", xData)
      AosPointsReviews = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In UpvotesResponse handler:
Handlers.add(
  "HelpfulRespons",
  Handlers.utils.hasMatchingTag("Action", "HelpfulRespons"),
  function(m)

    if m.From == PROCESS_ID_HELPFUL_TABLE then
        
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Helpful response.")
      return
      end
      print("Updated AosPointsHelpful Response:", xData)
      AosPointsHelpful = xData
        else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)


-- In UpvotesResponse handler:
Handlers.add(
  "BugReportAosRespons",
  Handlers.utils.hasMatchingTag("Action", "BugReportAosRespons"),
  function(m)

    if m.From == PROCESS_ID_BUG_REPORT_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated BugReport aosPoints Response:", xData)
      AosPointsBugReports = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In UpvotesResponse handler:
Handlers.add(
  "DevForumAosRespons",
  Handlers.utils.hasMatchingTag("Action", "DevForumAosRespons"),
  function(m)

    if m.From == PROCESS_ID_DEV_FORUM_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated DevForum Response:", xData)
      AosPointsDevForum = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In UpvotesResponse handler:
Handlers.add(
  "FeaturesAosRespons",
  Handlers.utils.hasMatchingTag("Action", "FeaturesAosRespons"),
  function(m)

    if m.From == PROCESS_ID_FEATURE_REQUEST_TABLE then
      local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosPointsFeatures Response:", xData)
      AosPointsFeatures = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In FlagTable handler:
Handlers.add(
  "FlagAosRespons",
  Handlers.utils.hasMatchingTag("Action", "FlagAosRespons"),
  function(m)

    if m.From == PROCESS_ID_FLAG_TABLE then
       local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosMainPointsFlags Response:", xData)
      AosPointsFlags = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In Airdrop handler:
Handlers.add(
  "FavoritesAosRespons",
  Handlers.utils.hasMatchingTag("Action", "FavoritesAosRespons"),
  function(m)

    if m.From == PROCESS_ID_FAVORITES_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in Favorites Table response.")
          return
        end
       local xData = json.decode(m.Data)
      if  xData  == nil then
      print("No data received in Main response.")
      return
      end
      print("Updated AosMainPointsFavorites Response:", xData)
      AosPointsFavorites = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In Airdops handler:
Handlers.add(
  "AirdropAosRespons",
  Handlers.utils.hasMatchingTag("Action", "AirdropAosRespons"),
  function(m)

    if m.From == PROCESS_ID_AIRDROP_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in Airdrop aospoints response.")
          return
        end
        print("Updated Airdrop aosPoints Table  Response:", xData)
        AosPointsAirdrops = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


-- In Tips handler:
Handlers.add(
  "TipsRespons",
  Handlers.utils.hasMatchingTag("Action", "TipsRespons"),
  function(m)

    if m.From == PROCESS_ID_TIPS_TABLE then
         local xData = m.Data
        if not xData then
          print("No data received in Airdrop aospoints response.")
          return
        end
        print("Updated aosPoints tips Table  Response:", xData)
        AosPointsTips = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)

-- In Tasks handler:
Handlers.add(
  "TasksAosRespons",
  Handlers.utils.hasMatchingTag("Action", "TasksAosRespons"),
  function(m)

    if m.From == PROCESS_ID_TASKS_TABLE then
          local xData = m.Data
        if not xData then
          print("No data received in Airdrop aospoints response.")
          return
        end
        print("Updated Tasks Table  Response:", xData)
        AosPointsTasks = xData
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)


Handlers.add(
    "GetAosPoints",
    Handlers.utils.hasMatchingTag("Action", "GetAosPoints"),
    function(m)
    
    DataCount = 0

    AddMainAosPoints(nil)
    AddAosPointsReviews(nil)
    AddAosPointsHelpful(nil)
    AddAosPointsBugReport(nil)
    AddAosPointsDevForum(nil)
    AddAosPointsFeatureRequest(nil)
    AddAosPointsFlagTable(nil)
    AddAosPointsFavorite(nil)
    AddAosPointsTasks(nil)
    AddAosPointsTips(nil)
    SendSuccess(m.From, "Message Suucessfully sent.")
    
      end
)

Handlers.add(
    "FetchMainAosPoints",
    Handlers.utils.hasMatchingTag("Action", "FetchMainAosPoints"),
    function(m)
    AddMainAosPoints(nil)
      end
)

Handlers.add(
    "FetchAosPointsX",
    Handlers.utils.hasMatchingTag("Action", "FetchAosPointsX"),
    function(m)
    AddMainAosPoints(nil)
    AddAosPointsAirdrop(nil)
    AddAosPointsReviews(nil)
    AddAosPointsFlagTable(nil)
    AddAosPointsFavorite(nil)
    AddAosPointsBugReport(nil)
    AddAosPointsDevForum(nil)
    AddAosPointsFeatureRequest(nil)
    AddAosPointsTasks(nil)
      end
)

Handlers.add(
    "FetchAirdropsAosPoints",
    Handlers.utils.hasMatchingTag("Action", "FetchAirdropsAosPoints"),
    function(m)
   
    AddAosPointsTips(nil)
      end
)



Handlers.add(
    "RankUsersB",
    Handlers.utils.hasMatchingTag("Action", "RankUsersB"),
    function(m)

        -- 1. Identify all users across all tables (even with zero/negative points)
        local allUsers = {}
        local aosTables = {
            {name = "AosPointsMain", table = AosPointsMain},
            {name = "AosPointsAirdrops", table = AosPointsAirdrops},
            {name = "AosPointsBugReports", table = AosPointsBugReports},
            {name = "AosPointsDevForum", table = AosPointsDevForum},
            {name = "AosPointsFavorites", table = AosPointsFavorites},
            {name = "AosPointsFeatures", table = AosPointsFeatures},
            {name = "AosPointsFlags", table = AosPointsFlags},
            {name = "AosPointsHelpful", table = AosPointsHelpful},
            {name = "AosPointsReviews", table = AosPointsReviews},
            {name = "AosPointsTasks", table =  AosPointsTasks},

        
            AosPointsTasks
        }

        -- First pass: Find EVERY user that exists in ANY table
        for _, tblInfo in ipairs(aosTables) do
            if type(tblInfo.table) == "table" then
                for appId, appData in pairs(tblInfo.table) do
                    if type(appData) == "table" and appData.users then
                        for userId, _ in pairs(appData.users) do
                            allUsers[userId] = true  -- Mark user as existing
                        end
                    end
                end
            end
        end

        -- 2. Now calculate points for ALL users (defaulting to 0 if no points found)
        local userPoints = {}
        for userId, _ in pairs(allUsers) do
            userPoints[userId] = 0  -- Initialize all users with 0 points
        end

        -- Second pass: Sum points from all tables
        for _, tblInfo in ipairs(aosTables) do
            if type(tblInfo.table) == "table" then
                for appId, appData in pairs(tblInfo.table) do
                    if type(appData) == "table" and appData.users then
                        for userId, userData in pairs(appData.users) do
                            if type(userData.points) == "number" then
                                userPoints[userId] = (userPoints[userId] or 0) + userData.points
                            end
                        end
                    end
                end
            end
        end

        -- 3. Generate detailed report BEFORE ranking
        print("\n==== COMPLETE USER REPORT ====")
        local totalPoints = 0
        for userId, points in pairs(userPoints) do
            totalPoints = totalPoints + points
            print(string.format("User %s: %d points", userId, points))
        end

        -- 4. Assign ranks (now including negative points)
        Rankings = {
            Oracle = {},
            Operator = {},
            RedPill = {},
            BluePill = {},
            Negative = {}  -- New category for negative points
        }

        for userId, points in pairs(userPoints) do
            points = tonumber(points) or 0
            
            if points < 0 then
                Rankings.Negative[userId] = points
            elseif points == 0 then
                Rankings.BluePill[userId] = points
            elseif totalPoints > 0 and (points/totalPoints) > 0.5 then
                Rankings.Oracle[userId] = points
            elseif totalPoints > 0 and (points/totalPoints) > 0.25 then
                Rankings.Operator[userId] = points
            else
                Rankings.RedPill[userId] = points
            end
        end

        -- 5. Enhanced response
        local data = {
                all_users_count = #allUsers,
                users_with_points_count = #userPoints,
                rankings = Rankings,
                userPoints = userPoints,
                stats = {
                    totalUsers = #allUsers,
                    usersWithNegativePoints = #Rankings.Negative,
                    usersWithZeroPoints = #Rankings.BluePill,
                    oracleUsers = #Rankings.Oracle,
                    operatorUsers = #Rankings.Operator,
                    redPillUsers = #Rankings.RedPill
                }
            }

        SendSuccess(m.From, data)
    end
)


Handlers.add(
    "GetUserRank",
    Handlers.utils.hasMatchingTag("Action", "GetUserRank"),
    function(m)
        local userId = m.From
        local response = {
            user = userId,
            rank = "BluePill",  -- Default rank
            points = 0,         -- Default points
            found = false
        }

        AosPointsBalance  = AosPointsBalance or {}
        
        if AosPointsBalance[userId] == nil then
            
            AosPointsBalance[userId] = { pointsSwapped = 0 }
        
        else
        
            AosPointsBalance[userId].pointsSwapped = AosPointsBalance[userId].pointsSwapped 
        end

        local pointsSwappedBalance = AosPointsBalance[userId].pointsSwapped
        

        -- Check all ranking categories for the user
        for category, users in pairs(Rankings or {}) do
            if users[userId] then
                response.rank = category
                -- Handle both formats: direct value (number) or table with points field
                response.points = type(users[userId]) == "number" and users[userId] or (users[userId].points or 0) - (pointsSwappedBalance)
                response.found = true
                break
            end
        end

        -- Send response (no need for separate found/not found cases)
        SendSuccess(m.From, response)
    end
)



Handlers.add(
    "SwapToAosTokens",
    Handlers.utils.hasMatchingTag("Action", "SwapToAosTokens"),
    function(m)
        local userId = m.From
        local pointsToSwap = tonumber(m.Tags.points) -- Case-sensitive tag

        -- ===== VALIDATION CHECKS =====
        -- 1. Validate points input
      
        if not ValidateField(pointsToSwap, "pointsToSwap", m.From) then return end

        
        AosPointsBalance  = AosPointsBalance or {}
        
        if AosPointsBalance[userId] == nil then
            
            AosPointsBalance[userId] = { pointsSwapped = 0 }
        
        else
        
            AosPointsBalance[userId].pointsSwapped = AosPointsBalance[userId].pointsSwapped 
        end
        
        local pointsSwappedBalance = AosPointsBalance[userId].pointsSwapped
        

        -- 2. Check user's current points balance (from your Rankings system)
        local userPoints = 0
        for _, category in pairs(Rankings or {}) do
            if category[userId] then
                userPoints = type(category[userId]) == "number"
                    and category[userId]
                    or (category[userId].points or 0)
                break
            end
        end
        
        local realBalance = userPoints - pointsSwappedBalance

        -- 3. Verify sufficient balance
        if realBalance <= pointsToSwap and pointsToSwap <= 0 then
            SendFailure(m.From, string.format(
                "Insufficient balance. You have %d points but requested %d.",
                userPoints,
                pointsToSwap
            ))
            return
        end

        -- ===== PROCESS SWAP =====
        -- 1. Calculate token amount (adjust conversion rate as needed)
       
        -- 2. Deduct points from user (pseudo-code - update your actual storage)
        -- This assumes you have a way to update Rankings globally
        for _, category in pairs(Rankings) do
            if category[userId] then
                if type(category[userId]) == "number" then
                    category[userId] = category[userId] - pointsToSwap
                    AosPointsBalance[userId].pointsSwapped = AosPointsBalance[userId].pointsSwapped + pointsToSwap
                else
                    category[userId].points = category[userId].points - pointsToSwap
                    AosPointsBalance[userId].pointsSwapped = AosPointsBalance[userId].pointsSwapped + pointsToSwap
                end
                break
            end
        end

         local conversionRate = 0.05  -- 1000 points = 50 tokens
        local quantity = pointsToSwap * 1000 * conversionRate   
        local recipient = userId
        
        local tokenId = PROCESS_ID_AOS_TOKEN

        if not ValidateField(tokenId, "tokenId", m.From) then return end
        if not ValidateField(quantity, "quantity", m.From) then return end
        if not ValidateField(recipient, "recipient", m.From) then return end

        local message  = Transfer(tokenId, quantity, recipient)

        if message == true then
              -- ===== SUCCESS RESPONSE =====
            SendSuccess(m.From, "Suucessfully swapped" .. quantity)
        else 
            SendFailure(m.From,"Transfer Failed...")
        end
    end
)


-- Test Handler
Handlers.add(
    "TestTransfer",
    Handlers.utils.hasMatchingTag("Action", "TestTransfer"),
    function(m)
        local params = {
            tokenId = PROCESS_ID_AOS_TOKEN,
            quantity = tonumber(10),
            recipient = "yCvSnKJXQFMn852960xFQUbSJXbUAfhQipLWVihrg1E"
        }

        -- Validate inputs
        if not ValidateField(params.tokenId, "tokenId", m.From) then return end
        if not ValidateField(params.quantity, "quantity", m.From) then return end
        if not ValidateField(params.recipient, "recipient", m.From) then return end

      
        local message  = Transfer(params.tokenId, params.quantity, params.recipient)

        if message == true then
            SendSuccess(m.From, "successful Sent" .. params.quantity)
        else 
            SendFailure(m.From,"Transfer Failed...")
        end
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
                user_transactions[#user_transactions + 1] = transaction
            end
        end

        -- Check if at least one banner is provided
        if #user_transactions == 0 then
            SendFailure(m.From, "You do not have any transactions")
          return
        end
        SendSuccess(m.From , user_transactions)
        end
)





Handlers.add(
    "ClearAosPointsMain",
    Handlers.utils.hasMatchingTag("Action", "ClearAosPointsMain"),
    function(m)
      AosPointsMain = {}
    end
)

