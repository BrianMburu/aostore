local json = require("json")
local math = require("math")




-- This process details.
PROCESS_NAME = "aos AppData"
PROCESS_ID = "vIrhkUTQQ_gB7LOKprYCsOP7ZkUBdBk0KeTKe-Qe3c4"


-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"

TransactionCounter = TransactionCounter or 0

Apps = Apps or {}


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





function FinalizeProject(user, appId, appName, description, currentTime, username, profileUrl, protocol,
                websiteUrl,
                twitterUrl,
                discordUrl,
                coverUrl,
                bannerUrls,
                companyName,
                appIconUrl,
                projectType)
    

    
   
    Apps = Apps or {}
    Apps.apps = Apps.apps or {}


    -- Ensure global tables are initialized
    AosPoints = AosPoints or {}
    Transactions = Transactions or {}

        -- Create the aosPoints table for this AppId
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

  

    Apps.apps[appId] = {
    appId = appId,
    owner = user,
    appName = appName,
    username = username,
    description = description,
    createdTime = currentTime,
    protocol = protocol,
    websiteUrl = websiteUrl,
    twitterUrl = twitterUrl,
    discordUrl = discordUrl,
    coverUrl = coverUrl,
    profileUrl = profileUrl,
    bannerUrls = bannerUrls,
    companyName = companyName,
    appIconUrl = appIconUrl,
    projectType = projectType,
    AosPoints = AosPoints[appId]}

    AosPoints[appId].status = true
  -- Reset statuses and DataCount
    ReviewStatus = false
    DataCount = 0

    local transactionType = "Project Creation."
    local amount = 0
    local points = 5
    LogTransaction(user, appId, transactionType, amount, currentTime, points)

end


Handlers.add(
    "AddAppsTable",
    Handlers.utils.hasMatchingTag("Action", "AddAppsTable"),
    function(m)
      local appId = m.Tags.appId
      local currentTime = m.Tags.currentTime
      local user = m.From
      local appName = m.Tags.appName
      local description = m.Tags.description
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      local protocol = m.Tags.protocol
      local websiteUrl = m.Tags.websiteUrl
      local twitterUrl = m.Tags.twitterUrl
      local discordUrl = m.Tags.discordUrl
      local coverUrl = m.Tags.coverUrl
      local bannerUrls = json.decode(m.Tags.bannerUrls)
      local companyName = m.Tags.companyName
      local appIconUrl = m.Tags.appIconUrl
      local projectType = m.Tags.projectType
      


        
    if not ValidateField(appId, "appId", m.From) then return end    
   if not ValidateField(profileUrl, "profileUrl", m.From) then return end    
   if not ValidateField(projectType, "projectType", m.From) then return end
    if not ValidateField(appIconUrl, "appIconUrl", m.From) then return end

    if not ValidateField(companyName, "companyName", m.From) then return end

   if not ValidateField(coverUrl, "coverUrl", m.From) then return end

   if not ValidateField(discordUrl, "discordUrl", m.From) then return end

   if not ValidateField(twitterUrl, "twitterUrl", m.From) then return end

   if not ValidateField(websiteUrl, "websiteUrl", m.From) then return end

    if not ValidateField(protocol, "protocol", m.From) then return end

   if not ValidateField(appId, "appId", m.From) then return end

    if not ValidateField(username, "username", m.From) then return end

   if not ValidateField(user, "user", m.From) then return end

        --Check if at least one banner is provided
   if #bannerUrls == 0 then
       local response = { code = 404, message = "failed", data = "At least one BannerUrl is required." }
      ao.send({ Target = m.From, Data = TableToJson(response) })
      return
    end

    Apps = Apps or {}
    Apps.apps = Apps.apps or {}

    -- Ensure global tables are initialized
    AosPoints = AosPoints or {}
    Transactions = Transactions or {}

        -- Create the aosPoints table for this AppId
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

  

    Apps.apps[appId] = {
    appId = appId,
    owner = user,
    appName = appName,
    username = username,
    description = description,
    createdTime = currentTime,
    protocol = protocol,
    websiteUrl = websiteUrl,
    twitterUrl = twitterUrl,
    discordUrl = discordUrl,
    coverUrl = coverUrl,
    profileUrl = profileUrl,
    bannerUrls = bannerUrls,
    companyName = companyName,
    appIconUrl = appIconUrl,
    projectType = projectType,
    AosPoints = AosPoints[appId]}

    AosPoints[appId].status = true
  -- Reset statuses and DataCount
    ReviewStatus = false
    DataCount = 0

    local transactionType = "Project Creation."
    local amount = 0
    local points = 5
    LogTransaction(user, appId, transactionType, amount, currentTime, points)
    
    local status = true

    ao.send({ Target = ARS, Action = "AppsRespons", Data = tostring(status)})
        
    -- Send success response
    print("Successfully Added Apps  table")
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
        if Apps.apps[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        -- Check if the user making the request is the current owner
        if Apps.apps[appId].owner ~= owner then
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
        Apps.apps[appId] = nil
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
        if Apps.apps[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        
        if not ValidateField(currentTime, "currentTime", m.From) then return end       
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end

        -- Check if the user making the request is the current owner
        if Apps.apps[appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        Apps.apps[appId].owner = newOwner
        Apps.apps[appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
    end
)

Handlers.add(
    "FetchAllApps",
    Handlers.utils.hasMatchingTag("Action", "FetchAllApps"),
    function(m)

    if not Apps or not Apps.apps or next(Apps.apps) == nil then
        SendFailure(m.From, "Apps are nil")
    end

        local filteredApps = {}
        for appId, app in pairs(Apps.apps) do
            filteredApps[appId] = {
                appId = app.appId,
                appName = app.appName,
                description = app.description,
                companyName = app.companyName,
                projectType = app.projectType,
                websiteUrl = app.websiteUrl,
                appIconUrl = app.appIconUrl,
                createdTime = app.createdTime,
                protocol = app.protocol
            }
        end
       
        SendSuccess(m.From, filteredApps)
        end
)

Handlers.add(
    "getMyApps",
    Handlers.utils.hasMatchingTag("Action", "getMyApps"),
    function(m)
        local owner = m.From

        if not Apps or not Apps.apps or next(Apps.apps) == nil then
        SendFailure(m.From, "Apps are nil")
        end

        -- Filter apps owned by the user from the nested 'apps' table
        local filteredApps = {}
        for AppId, app in pairs(Apps.apps) do
            if app.owner == owner then
                filteredApps[AppId] = {
                appId = app.appId,
                appName = app.appName,
                description = app.description,
                companyName = app.companyName,
                projectType = app.projectType,
                websiteUrl = app.websiteUrl,
                appIconUrl = app.appIconUrl,
                createdTime = app.createdTime,
                 protocol = app.protocol
                }
            end
        end
        SendSuccess(m.From, filteredApps)
        end
)

Handlers.add(
    "UpdateAppDetails",
    Handlers.utils.hasMatchingTag("Action", "UpdateAppDetails"),
    function(m)
        local appId = m.Tags.AppId
        local updateOption = m.Tags.updateOption
        local newValue = m.Tags.NewValue
        local currentowner = m.From
        local currentTime = GetCurrentTime()

        if not ValidateField(appId, "appId", m.From) then return end

        if not ValidateField(updateOption, "updateOption", m.From) then return end

        if not ValidateField(newValue, "newValue", m.From) then return end

        -- Check if the app exists
        if not Apps.apps[appId] then
            SendFailure(m.From , "App not Found")
            return
        end

        -- Check if the user making the request is the current owner
        if Apps[appId].owner ~= currentowner then
            SendFailure(m.From , "You are not the Owner of this App")
            return
        end

        -- List of valid fields that can be updated
        local validUpdateOptions = {
            ownerUserName = true,
            AppName = true,
            Description = true,
            Protocol = true,
            WebsiteUrl = true,
            TwitterUrl = true,
            DiscordUrl = true,
            CoverUrl = true,
            profileUrl = true,
            CompanyName = true,
            AppIconUrl = true,
        }

        if not validUpdateOptions[updateOption] then
            SendFailure(m.From , "Invalid Update Option.")
            return
        end

        -- **Initialize missing field if necessary**
        if Apps.app[appId][updateOption] == nil then
            Apps.app[appId][updateOption] = ""
        end

        -- Perform the update
        Apps[appId][updateOption] = newValue
        local transactionType = "Updated.".. updateOption
        local amount = 0
        local points = 1
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        SendSuccess(m.From, " Update Succesful.")
        end
)

Handlers.add(
     "FetchAppDetails",
     Handlers.utils.hasMatchingTag("Action", "FetchAppDetails"),
     function(m)
        
         -- Extract the AppId from the message
         local appId = m.Tags.appId
 
         -- Check if the app exists
        if not Apps.apps[appId] then
            SendFailure(m.From , "App not Found")
            return
        end
 
         -- Fetch the app details
         local appDetails = Apps.apps[appId]
 
         -- Prepare the response with all relevant app details
         local AppInfoResponse = {
             appId = appDetails.appId,
             appName = appDetails.appName,
             description = appDetails.description,
             protocol = appDetails.protocol,
             websiteUrl = appDetails.websiteUrl,
             twitterUrl = appDetails.twitterUrl,
             discordUrl = appDetails.discordUrl,
             coverUrl = appDetails.coverUrl,
             companyName = appDetails.companyName,
             appIconUrl = appDetails.appIconUrl,
             projectType = appDetails.projectType,
             createdTime = appDetails.createdTime,
             owner = appDetails.owner,
             bannerUrls = appDetails.bannerUrls,
             username = appDetails.username,
             profileUrl = appDetails.profileUrl
         }
         SendSuccess(m.From , AppInfoResponse)
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
            Action = "MainAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent Main handler aosPoints table")
    end
)

Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)
        Apps = {}
        AosPoints =  {}
        Transactions = Transactions or {}
        TransactionCounter = 0
   
    end
)