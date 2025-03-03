local json = require("json")
local math = require("math")




-- This process details.
PROCESS_NAME = "aos aostoreP"
PROCESS_ID = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

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
PROCESS_ID_DEV_FORUM_TABLE = "V7KLJ9Fc48sb6VstzR3JPSymVhrF7dlP-Vt4W25-7bo"


-- Feature Requests details
PROCESS_NAME_FEATURE_REQUEST_TABLE = "aos featureRequestsTable"
PROCESS_ID_FEATURE_REQUEST_TABLE = "YGoIdaqLZauaH3aNLKyWdoFHTg0Voa5O3NhCMWKHRtY"

-- This flag Table details
PROCESS_NAME_FLAG_TABLE = "aos Flag_Table"
PROCESS_ID_FLAG_TABLE = "BpGlNnMA09jM-Sfh6Jldswhp5AnGTCST4MxG2Dk-ABo"


--Unhelpful Table process
PROCESS_NAME_UNHELPFUL_TABLE = "aos UnHelpful_Table"
PROCESS_ID_UNHELPFUL_TABLE = "f4alCYxrBPDMOmTIBfHB43m1snkZSKdPqpr0Tr93t-U"


-- Airdrop process details
PROCESS_NAME_AIRDROP_TABLE = "aos Airdrop_Table"
PROCESS_ID_AIRDROP_TABLE  = "ow_4lNzwLheZht2vC0k53MlIi9Tfw57_871KvTKOOpY"


-- tables 
Apps = Apps or {}
transactions  = transactions or {}
favoritesTable = favoritesTable or {}
aosPoints = aosPoints or {}
-- Counters variables 
AppCounter  = AppCounter or 0

-- Status Variables
ReviewStatus = ReviewStatus or false
HelpfulStatus  = HelpfulStatus or false
BugStatus = BugStatus or false
DevForumStatus = DevForumStatus or false

-- Callback Variables
fetchreviewsCallback = nil
fetchhelpfulCallback = nil
fetchbugreportsCallback = nil
fetchdevforumCallback  = nil
fetchfeaturetableCallback = nil
fetchflagtableCallback  = nil
fetchunhelpfullCallback = nil
fetchairdropCallback = nil


function AddReviewTable(AppId, user,username,profileUrl,callback)
    ao.send({
        Target = PROCESS_ID_REVIEW_TABLE,
        Tags = {
            { name = "Action", value = "AddReviewTableX" },
            { name = "appId",  value = tostring(AppId) },
            { name = "user",   value = tostring(user) },
            { name = "username", value = tostring(username) },
            { name = "profileUrl",   value = tostring(profileUrl) }
        }
    })
    -- Save the callback to be called later
    fetchreviewsCallback = callback
end

function ChangeOwnerReviewTable(AppId, newOwner,currentOwner, callback)
    ao.send({
        Target = PROCESS_ID_REVIEW_TABLE,
        Tags = {
            { name = "Action", value = "ChangeAppOwnership" },
            { name = "appId",  value = tostring(AppId) },
            { name = "NewOwner",   value = tostring(newOwner) },
              { name = "currentOwner",   value = tostring(currentOwner) },
        }
    })
    -- Save the callback to be called later
    fetchreviewsCallback = callback
end



function AddHelpfulTable(AppId , user,callback)
    ao.send({
        Target = PROCESS_ID_HELPFUL_TABLE,
        Tags = {
            { name = "Action", value = "AddHelpfulTableX" },
            { name = "appId",  value = tostring(AppId) },
            { name = "user", value = tostring(user) },
        }
    })
     -- Save the callback to be called later
    fetchhelpfulCallback = callback
end


function AddBugReportTable(AppId, user,profileUrl,username,callback)
    ao.send({
        Target = PROCESS_ID_BUG_REPORT_TABLE,
        Tags = {
            { name = "Action", value = "AddBugReportTable" },
            { name = "appId",  value = tostring(AppId) },
            { name = "user", value = tostring(user) },
            { name = "username", value = tostring(username) },
            { name = "profileUrl", value = tostring(profileUrl) },
        }
    })
    -- Save the callback to be called later
    fetchbugreportsCallback = callback
end


function AddDevForumTable(AppId, user, profileUrl, username, callback)
    ao.send({
        Target = PROCESS_ID_DEV_FORUM_TABLE,
        Tags = {
            { name = "Action",     value = "AddDevForumTable" },
            { name = "appId",      value = tostring(AppId) },
            { name = "user",       value = tostring(user) },
            { name = "username",   value = tostring(username) },
            { name = "profileUrl", value = tostring(profileUrl) }
        }
    })
    -- Save the callback to be called later
    fetchdevforumCallback = callback
end

function AddFeatureRequestTable(AppId, user, profileUrl, username, callback)
    ao.send({
        Target = PROCESS_ID_FEATURE_REQUEST_TABLE,
        Tags = {
            { name = "Action",value = "AddfeatureRequestsTable" },
            { name = "appId",value = tostring(AppId) },
            { name = "user",value = tostring(user) },
            { name = "username",value = tostring(username) },
            { name = "profileUrl", value = tostring(profileUrl) }
        }
    })
    -- Save the callback to be called later
    fetchfeaturetableCallback = callback
end

function AddFlagTable(AppId , user,callback)
    ao.send({
        Target = PROCESS_ID_FLAG_TABLE,
        Tags = {
            { name = "Action", value = "AddFlagTableX" },
            { name = "appId",  value = tostring(AppId) },
            { name = "user", value = tostring(user) },
        }
    })
     -- Save the callback to be called later
    fetchflagtableCallback = callback
end

function AddUnHelpfulTable(AppId, user, callback)
    ao.send({
        Target = PROCESS_ID_UNHELPFUL_TABLE,
        Tags = {
            { name = "Action", value = "AddUnhelpfulTable" },
            { name = "appId",  value = tostring(AppId) },
            { name = "user",   value = tostring(user) },
        }
    })
    -- Save the callback to be called later
    fetchunhelpfullCallback = callback
end

function AddAirdropTable(AppId , user,AppName, callback)
    ao.send({
        Target = PROCESS_ID_AIRDROP_TABLE,
        Tags = {
            { name = "Action", value = "AddAirdropTable" },
            { name = "appId",  value = tostring(AppId) },
            { name = "user",   value = tostring(user) },
             { name = "AppName", value = tostring(AppName) },
        }
    })
     -- Save the callback to be called later
    fetchairdropCallback = callback
end



function finalizeProject(user, AppId, appName, description, currentTime, username, profileUrl, Protocol,
                WebsiteUrl,
                TwitterUrl,
                DiscordUrl,
                CoverUrl,
                BannerUrl1,
                BannerUrl2,
                BannerUrl3,
                BannerUrl4,
                CompanyName,
                AppIconUrl,
                ProjectType)
    

    
    -- Ensure Apps table and its sub-table are properly initialized
    if not Apps or type(Apps) ~= "table" then
        Apps = { apps = {}, count = 0, countHistory = {} }
    elseif not Apps.apps or type(Apps.apps) ~= "table" then
        Apps.apps = {}
    end

    -- Ensure global tables are initialized
    favoritesTable = favoritesTable or {}
    aosPoints = aosPoints or {}
    transactions = transactions or {}
    
    favoritesTable[AppId] = {
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
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { time = currentTime , points = 5 }
            }
        }

  

    Apps.apps[AppId] = {
      appId = AppId,
      Owner = user,
      AppName = appName,
      username = username,
      Description = description,
      CreatedTime = currentTime,
      Protocol = Protocol,
      WebsiteUrl = WebsiteUrl,
      TwitterUrl = TwitterUrl,
      DiscordUrl = DiscordUrl,
      CoverUrl = CoverUrl,
      profileUrl = profileUrl,
      BannerUrl1 = BannerUrl1,
      BannerUrl2 = BannerUrl2,
      BannerUrl3 = BannerUrl3,
      BannerUrl4 = BannerUrl4,
      CompanyName = CompanyName,
      AppIconUrl = AppIconUrl,
      ProjectType = ProjectType,
      Favorites = favoritesTable[AppId],
      aosPoints = aosPoints[AppId]}

    favoritesTable[AppId].status = true
    aosPoints[AppId].status = true
  -- Reset statuses and DataCount
    ReviewStatus = false
    DataCount = 0

    local transactionId = generateTransactionId()
    local currentPoints = aosPoints[AppId].users[user].points
    
    transactions[#transactions + 1] = {
            user = user,
            transactionid = transactionId,
            type = "Project Creation",
            points = currentPoints,
            timestamp = currentTime
        }

  print("Apps table after update: " .. tableToJson(Apps))

end




-- In ReviewsResponse handler:
Handlers.add(
  "ReviewsRespons",
  Handlers.utils.hasMatchingTag("Action", "ReviewsRespons"),
  function(m)
    local xData = m.Data
    if not xData then
      print("No data received in response.")
      return
    end
    if xData == "true" then
    ReviewStatus = true
    DataCount = DataCount + 1
    print("Updated Review Response:", xData)
    -- Check if we have reached the required count
    if DataCount >= 8 and globalFinalizeProjectCallback then
      globalFinalizeProjectCallback()
    end
    end
  end
)

-- In UpvotesResponse handler:
Handlers.add(
  "HelpfulRespons",
  Handlers.utils.hasMatchingTag("Action", "HelpfulRespons"),
  function(m)

    if m.From == PROCESS_ID_HELPFUL_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in Helpful response.")
          return
        end
      if xData == "true" then
          HelpfulStatus = true
          DataCount = DataCount + 1
          print("Updated Helpful Response:", xData)
          -- Check if we have reached the required count
          if DataCount >= 8 and globalFinalizeProjectCallback then
              globalFinalizeProjectCallback()
          end
      end
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)


-- In UpvotesResponse handler:
Handlers.add(
  "BugRespons",
  Handlers.utils.hasMatchingTag("Action", "BugRespons"),
  function(m)

    if m.From == PROCESS_ID_BUG_REPORT_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in Helpful response.")
          return
        end
      if xData == "true" then
          BugStatus = true
          DataCount = DataCount + 1
          print("Updated Bug  Response:", xData)
          -- Check if we have reached the required count
          if DataCount >= 8 and globalFinalizeProjectCallback then
              globalFinalizeProjectCallback()
          end
      end
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In UpvotesResponse handler:
Handlers.add(
  "DevForumRespons",
  Handlers.utils.hasMatchingTag("Action", "DevForumRespons"),
  function(m)

    if m.From == PROCESS_ID_DEV_FORUM_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in DevForum Table response.")
          return
        end
      if xData == "true" then
          DevForumStatus = true
          DataCount = DataCount + 1
          print("Updated Dev Forum  Response:", xData)
          -- Check if we have reached the required count
          if DataCount >= 8 and globalFinalizeProjectCallback then
              globalFinalizeProjectCallback()
          end
      end
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In UpvotesResponse handler:
Handlers.add(
  "FeatureRequestRespons",
  Handlers.utils.hasMatchingTag("Action", "FeatureRequestRespons"),
  function(m)

    if m.From == PROCESS_ID_FEATURE_REQUEST_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in feature Table response.")
          return
        end
      if xData == "true" then
          DataCount = DataCount + 1
          print("Updated Feature Table  Response:", xData)
          -- Check if we have reached the required count
          if DataCount >= 8 and globalFinalizeProjectCallback then
              globalFinalizeProjectCallback()
          end
      end
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
      
  end
)

-- In FlagTable handler:
Handlers.add(
  "FlagRespons",
  Handlers.utils.hasMatchingTag("Action", "FlagRespons"),
  function(m)

    if m.From == PROCESS_ID_FLAG_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in flag  Table response.")
          return
        end
      if xData == "true" then
          DevForumStatus = true
          DataCount = DataCount + 1
          print("Updated  flag  Table  Response:", xData)
          -- Check if we have reached the required count
          if DataCount >= 8 and globalFinalizeProjectCallback then
              globalFinalizeProjectCallback()
          end
      end
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)

-- In Unhelpful handler:
Handlers.add(
  "UnHelpfulRespons",
  Handlers.utils.hasMatchingTag("Action", "UnHelpfulRespons"),
  function(m)

    if m.From == PROCESS_ID_UNHELPFUL_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in unhelpful   Table response.")
          return
        end
      if xData == "true" then
          DevForumStatus = true
          DataCount = DataCount + 1
          print("Updated unhelpful  Table  Response:", xData)
          -- Check if we have reached the required count
          if DataCount >= 8 and globalFinalizeProjectCallback then
              globalFinalizeProjectCallback()
          end
      end
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)

-- In Airdrop handler:
Handlers.add(
  "AirdopRespons",
  Handlers.utils.hasMatchingTag("Action", "AirdopRespons"),
  function(m)

    if m.From == PROCESS_ID_AIRDROP_TABLE then
        local xData = m.Data
        if not xData then
          print("No data received in Airdrop Table response.")
          return
        end
      if xData == "true" then
          DataCount = DataCount + 1
          print("Updated Airdrop Table  Response:", xData)
          -- Check if we have reached the required count
          if DataCount >= 8 and globalFinalizeProjectCallback then
              globalFinalizeProjectCallback()
          end
      end
    else
        ao.send({ Target = m.From, Data = "Wrong ProcessID" })
    end
  end
)



Handlers.add(
    "AddProject",
    Handlers.utils.hasMatchingTag("Action", "AddProject"),
    function(m)
      local AppId = generateAppId()
      local currentTime = getCurrentTime(m)
      local user = m.From
      local appName = m.Tags.appName
      local description = m.Tags.description
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      local Protocol = m.Tags.Protocol
      local WebsiteUrl = m.Tags.WebsiteUrl
      local TwitterUrl = m.Tags.TwitterUrl
      local DiscordUrl = m.Tags.DiscordUrl
      local CoverUrl = m.Tags.CoverUrl
      local BannerUrl1 = m.Tags.BannerUrl1
      local BannerUrl2 = m.Tags.BannerUrl2 
      local BannerUrl3 = m.Tags.BannerUrl3
      local BannerUrl4 = m.Tags.BannerUrl4 
      local CompanyName = m.Tags.CompanyName
      local AppIconUrl = m.Tags.AppIconUrl
      local ProjectType = m.Tags.ProjectType
      
      if user == nil then
            ao.send({ Target = m.From, Data = "user is missing or empty." })
            return
      end
        
      if AppId == nil then
            ao.send({ Target = m.From, Data = "appId is missing or empty." })
            return
      end
        
      if profileUrl == nil then
            ao.send({ Target = m.From, Data = "profileUrl is missing or empty." })
            return
      end
        
      if username == nil then
            ao.send({ Target = m.From, Data = "username is missing or empty." })
            return
      end
      if Protocol == nil then
            ao.send({ Target = m.From, Data = "Protocol is missing or empty." })
            return
      end
      
      if WebsiteUrl == nil then
            ao.send({ Target = m.From, Data = "WebsiteUrl is missing or empty." })
            return
      end
      

      if TwitterUrl == nil then
            ao.send({ Target = m.From, Data = "TwitterUrl is missing or empty." })
            return
      end
      
      if DiscordUrl == nil then
            ao.send({ Target = m.From, Data = "DiscordUrl is missing or empty." })
        return
      end
      
      if CoverUrl == nil then
          ao.send({ Target = m.From, Data = "CoverUrl is missing or empty." })
        return
      end
      if BannerUrl1 == nil then
          ao.send({ Target = m.From, Data = "BannerUrl1 is missing or empty." })
        return
      end
      if BannerUrl2 == nil then
            ao.send({ Target = m.From, Data = "BannerUrl2 is missing or empty." })
          return
      end
      if BannerUrl3 == nil then
            ao.send({ Target = m.From, Data = "BannerUrl3 is missing or empty." })
            return
      end
      if BannerUrl4 == nil then
            ao.send({ Target = m.From, Data = "BannerUrl4 is missing or empty." })
            return
      end
      if CompanyName == nil then
            ao.send({ Target = m.From, Data = "CompanyName is missing or empty." })
            return
      end
      
      if AppIconUrl == nil then
            ao.send({ Target = m.From, Data = "AppIconUrl is missing or empty." })
            return
      end
        if ProjectType == nil then
            ao.send({ Target = m.From, Data = "ProjectType is missing or empty." })
            return
        end
  
        
        DataCount = 0
  
        AddReviewTable(AppId, user, username, profileUrl,nil)
        AddHelpfulTable(AppId, user, nil)
        AddBugReportTable(AppId, user,profileUrl,username,nil)
      

        AddDevForumTable(AppId, user, profileUrl, username, nil)
        AddFeatureRequestTable(AppId, user, profileUrl, username, nil)
        AddFlagTable(AppId , user,nil) 
        AddUnHelpfulTable(AppId, user, nil)
        AddAirdropTable(AppId, user, appName, nil)
        

        -- Set the finalize callback to be called when DataCount reaches 2
        globalFinalizeProjectCallback = function()
            finalizeProject(user, AppId, appName, description, currentTime, username, profileUrl, Protocol,
                WebsiteUrl,
                TwitterUrl,
                DiscordUrl,
                CoverUrl,
                BannerUrl1,
                BannerUrl2,
                BannerUrl3,
                BannerUrl4,
                CompanyName,
                AppIconUrl,
                ProjectType)
            -- Clear the callback so it's only called once
            globalFinalizeProjectCallback = nil
        end
       
        ao.send({ Target = user, Data = "Successfully Created The Project." })
        
    end
)

Handlers.add(
    "getFavoriteApps",
    Handlers.utils.hasMatchingTag("Action", "getFavoriteApps"),
    function(m)
        local filteredFavorites = {}

        -- Loop through the favoritesTable to find the user's favorites
        for AppId, favorite in pairs(favoritesTable) do
            -- Check if the user exists in the `users` table for the current AppId
            if favorite.users[m.From] then
                -- Retrieve the app details from the Apps table
                local appDetails = Apps.apps[AppId]
                if appDetails then
                    -- Format the app details to include only the required fields
                    filteredFavorites[AppId] = {
                        AppIconUrl = appDetails.AppIconUrl,
                        AppId = AppId,
                        AppName = appDetails.AppName,
                        CompanyName = appDetails.CompanyName,
                        ProjectType = appDetails.ProjectType,
                        WebsiteUrl = appDetails.WebsiteUrl
                    }
                end
            end
        end

        -- Send the filtered favorites back to the user
        ao.send({ Target = m.From, Data = tableToJson(filteredFavorites) })
    end
)

Handlers.add(
    "FetchAllApps",
    Handlers.utils.hasMatchingTag("Action", "FetchAllApps"),
    function(m)

      if not Apps or not Apps.apps or next(Apps.apps) == nil then
      local response = {}
      response.code = 404
      response.message = "failed"
      response.data = "null"
    ao.send({ Target = m.From, Data = tableToJson(response) })
    return
    end

        local filteredApps = {}
        for appId, app in pairs(Apps.apps) do
            filteredApps[appId] = {
                AppId = app.AppId,
                AppName = app.AppName,
                Description = app.Description,
                CompanyName = app.CompanyName,
                ProjectType = app.ProjectType,
                WebsiteUrl = app.WebsiteUrl,
                AppIconUrl = app.AppIconUrl,
                CreatedTime = app.CreatedTime
            }
        end

        local response = {}
        response.code = 200
        response.message = "success"
        response.data = filteredApps

        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)

Handlers.add(
    "getMyApps",
    Handlers.utils.hasMatchingTag("Action", "getMyApps"),
    function(m)
        local owner = m.From

        -- Check if the Apps table is empty
        if not Apps or not Apps.apps or next(Apps.apps) == nil then
          local response = {}
          response.code = 404
          response.message = "failed"
          response.data = "null"
          ao.send({ Target = m.From, Data = tableToJson(response) })
          return
        end

        -- Filter apps owned by the user from the nested 'apps' table
        local filteredApps = {}
        for AppId, App in pairs(Apps.apps) do
            if App.Owner == owner then
                filteredApps[AppId] = {
                    AppId = App.AppId,
                    AppName = App.AppName,
                    Description = App.Description,
                    CompanyName = App.CompanyName,
                    ProjectType = App.ProjectType,
                    WebsiteUrl = App.WebsiteUrl,
                    AppIconUrl = App.AppIconUrl,
                    CreatedTime = App.CreatedTime
                }
            end
        end

        local response = {}
        response.code = 200
        response.message = "success"
        response.data = filteredApps

        ao.send({ Target = m.From, Data = tableToJson(response) })
    end
)



Handlers.add(
    "TransferAppOwnership",
    Handlers.utils.hasMatchingTag("Action", "TransferAppOwnership"),
    function(m)
        local appId = m.Tags.AppId
        local newOwner = m.Tags.NewOwner
        local currentOwner = m.From
        local currentTime = getCurrentTime()

        -- Validate input
        if not appId or not newOwner then
            ao.send({ Target = m.From, Data = "AppId or NewOwner is missing." })
            return
        end

        -- Check if the app exists
        if not Apps[appId] then
            ao.send({ Target = m.From, Data = "App not found." })
            return
        end

        -- Check if the user making the request is the current owner
        if Apps[appId].Owner ~= currentOwner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        -- Transfer ownership
        Apps[appId].Owner = newOwner

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
        ao.send({ Target = m.From, Data = "Ownership transferred to " .. newOwner })
    end
)


Handlers.add(
    "DeleteApp",
    Handlers.utils.hasMatchingTag("Action", "DeleteApp"),
    function(m)
        -- Check if the required AppId tag is present
        if not m.Tags.AppId or m.Tags.AppId == "" then
            print("Error: AppId is nil or empty.")
            ao.send({ Target = m.From, Data = "AppId is missing or empty." })
            return
        end

         local appId = m.Tags.AppId


        -- Check if the app exists
        if not Apps[appId] then
            print("Error: App with AppId " .. appId .. " not found.")
            ao.send({ Target = m.From, Data = "App not found." })
            return
        end

             -- Get the app owner
        local appOwner = Apps[appId].Owner

        -- Check if the caller is the app owner or the process admin
        if m.From == appOwner then
            -- Delete the app from the Apps table
            Apps.app[appId] = nil
            -- Send success message
            ao.send({ Target = m.From, Data = "Successfully deleted the app, all associated data, and airdrops." })
        else
            -- If the caller is not the owner or admin, send an error message
            print("Unauthorized delete attempt by " .. m.From)
            ao.send({ Target = m.From, Data = "You are not the app owner or admin." })
        end
    end
)


Handlers.add(
    "UpdateAppDetails",
    Handlers.utils.hasMatchingTag("Action", "UpdateAppDetails"),
    function(m)

        -- Check if all required m.Tags are present
        local requiredTags = { "NewValue", "AppId", "UpdateOption" }

        for _, tag in ipairs(requiredTags) do
            if m.Tags[tag] == nil then
                print("Error: " .. tag .. " is nil.")
                ao.send({ Target = m.From, Data = tag .. " is missing or empty." })
                return
            end
        end

        local appId = m.Tags.AppId
        local updateOption = m.Tags.UpdateOption
        local newValue = m.Tags.NewValue
        local currentOwner = m.From

        -- Validate input
        if not appId or not updateOption or not newValue then
            ao.send({ Target = m.From, Data = "AppId, UpdateOption, or NewValue is missing." })
            return
        end

        -- Check if the app exists
        if not Apps[appId] then
            ao.send({ Target = m.From, Data = "App not found." })
            return
        end

        -- Check if the user making the request is the current owner
        if Apps[appId].Owner ~= currentOwner then
            ao.send({ Target = m.From, Data = "You are not the owner of this app." })
            return
        end

        -- List of valid fields that can be updated
        local validUpdateOptions = {
            OwnerUserName = true,
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
            BannerUrl1 = true,
            BannerUrl2 = true,
            BannerUrl3 = true,
            BannerUrl4 = true,
        }

        if not validUpdateOptions[updateOption] then
            ao.send({ Target = m.From, Data = "Invalid UpdateOption." })
            return
        end

        -- **Initialize missing field if necessary**
        if Apps[appId][updateOption] == nil then
            Apps[appId][updateOption] = ""
        end

        -- Perform the update
        Apps[appId][updateOption] = newValue

        -- Reward logic
        local points = 40
        local userPointsData = getOrInitializeUserPoints(currentOwner)
        userPointsData.points = userPointsData.points + points
        local amount = 1 * 1000000000000
        local transactionId = generateTransactionId()

        ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(currentOwner)
        })

        table.insert(transactions, {
            user = currentOwner,
            transactionid = transactionId,
            type = "Updated Project.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })

        ao.send({ Target = m.From, Data = updateOption .. " updated successfully." })
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
    "SendNotificationToInbox",
    Handlers.utils.hasMatchingTag("Action", "SendNotificationToInbox"),
    function(m)
        local appId = m.Tags.AppId
        local message = m.Tags.Message
        local Header = m.Tags.Header
        local LinkInfo = m.Tags.LinkInfo
        local sender = m.From
        local currentTime = getCurrentTime(m) -- Ensure you have a function to get the current timestamp
        

        -- Check for required parameters
        if not appId or not message then
            ao.send({ Target = m.From, Data = "AppId and Message are required." })
            return
        end

        -- Verify that the app exists
        local appDetails = Apps[appId]
        if not appDetails then
            ao.send({ Target = m.From, Data = "App not found." })
            return
        end

        -- Verify that the sender is the owner of the app
        if appDetails.Owner ~= sender then
            ao.send({ Target = m.From, Data = "You are not authorized to send messages for this app." })
            return
        end

        -- Check if the app has any favorites
        local favorites = favoritesTable[appId]
        if not favorites or not favorites.users then
            ao.send({ Target = m.From, Data = "No users have favorited this app." })
            return
        end

        -- Send the message to each user's inbox
        for userId, _ in pairs(favorites.users) do
            -- Function to initialize a user's inbox if it doesn't exist
            local function initializeUserInbox(userId)
                inboxTable[userId] = inboxTable[userId] or {}
            end

            initializeUserInbox(userId)

            table.insert(inboxTable[userId], {
                AppId = appId,
                AppName = appDetails.AppName,
                AppIconUrl = appDetails.AppIconUrl,
                Message = message,
                Header = Header,
                LinkInfo = LinkInfo,
                currentTime = currentTime
            })
        end

         local points = 50
        local userPointsData = getOrInitializeUserPoints(user)
        userPointsData.points = userPointsData.points + points
        local amount = 5 * 1000000000000
        local transactionId = generateTransactionId()
         ao.send({
            Target = ARS,
            Action = "Transfer",
            Quantity = tostring(amount),
            Recipient = tostring(user)
        })
        table.insert(transactions, {
            user = user,
            transactionid = transactionId,
            type = "Sent Messages to users.",
            amount = amount,
            points = userPointsData.points,
            timestamp = currentTime
        })

        -- Confirm the notifications were sent
        ao.send({ Target = m.From, Data = "Message successfully added to the inbox of all users who favorited your app." })
    end
)


Handlers.add(
    "GetUserInbox",
    Handlers.utils.hasMatchingTag("Action", "GetUserInbox"),
    function(m)
        local userId = m.From

        -- Check if the user has any messages in their inbox
        local userInbox = inboxTable[userId] or {}

        -- Return the user's inbox as a JSON object
        ao.send({ Target = userId, Data = tableToJson(userInbox) })
    end
)



Handlers.add(
    "ClearApps",
    Handlers.utils.hasMatchingTag("Action", "ClearApps"),
    function(m)
      Apps.apps = {}
    end
)

Handlers.add(
    "ResetDataCount",
    Handlers.utils.hasMatchingTag("Action", "ResetDataCount"),
    function(m)
      DataCount = 0
    end
)