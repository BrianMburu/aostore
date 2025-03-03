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
flagaosPointsTable   = flagTable or {}
helpfulTable = helpfulTable or {}
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



function finalizeProject(user, AppId, appName, description, currentTime, profileUrl, Protocol,
    WebsiteUrl,
    TwitterUrl,
    DiscordUrl,
    CoverUrl,
    BannerUrl1,
    BannerUrl2,
    BannerUrl3,
    BannerUrl4,
    CompanyName,
    username,
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

    aosPoints[AppId] = {
            status = false,
            totalPoints = 15,
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = {
                [user] = { time = currentTime , points = 15 }
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



Handlers.add(
  "AddProjectZ",
  Handlers.utils.hasMatchingTag("Action", "AddProjectZ"),
  function(m)
      local currentTime = getCurrentTime(m)
      local AppId = generateAppId()
      local user = m.From
      local appName = "aostore testX"
      local description = "This is a test App"

      -- Reset DataCount for this transaction
        DataCount = 0
      
           -- Call the add functions
      AddReviewTable(AppId, user, nil)
      AddHelpfulTable(AppId, user)   

      -- Set the finalize callback to be called when DataCount reaches 2
      globalFinalizeProjectCallback = function()
        finalizeProject(user, AppId, appName, description, currentTime)
          
        end
  end
)

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
    "AddReview",
    Handlers.utils.hasMatchingTag("Action", "AddReview"),
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
      local Rank = m.Tags.rank
      
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
    "AddHelpfulRating",
    Handlers.utils.hasMatchingTag("Action", "AddHelpfulRating"),
    function(m)
      local AppId = generateAppId()
      local user = m.From
      AddHelpfulTable(AppId, user, nil)
    end
)

Handlers.add(
    "AddUnHelpfulRating",
    Handlers.utils.hasMatchingTag("Action", "AddUnHelpfulRating"),
    function(m)
      local AppId = generateAppId()
      local user = m.From
      AddUnHelpfulTable(AppId, user, nil)
    end
)

Handlers.add(
    "AddAidropTable",
    Handlers.utils.hasMatchingTag("Action", "AddAidropTable"),
    function(m)
      local AppId = generateAppId()
      local user = m.From
      local AppName = "aostore"
      AddAirdropTable(AppId, user,AppName,  nil)
    end
)

Handlers.add(
    "AddFlagTableX",
    Handlers.utils.hasMatchingTag("Action", "AddFlagTableX"),
    function(m)
      local AppId = generateAppId()
      local user = m.From
      AddFlagTable(AppId, user, nil)
    end
)


Handlers.add(
    "AddBugReportX",
    Handlers.utils.hasMatchingTag("Action", "AddBugReportX"),
    function(m)
      local AppId = generateAppId()
      local user = m.From
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      AddBugReportTable(AppId, user,profileUrl,username,nil)
    end
)

Handlers.add(
    "AddDevTable",
    Handlers.utils.hasMatchingTag("Action", "AddDevTable"),
    function(m)
      local AppId = generateAppId()
      local user = m.From
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      AddDevForumTable(AppId, user,profileUrl,username,nil)
    end
)

Handlers.add(
    "AddFeatureRequestTable",
    Handlers.utils.hasMatchingTag("Action", "AddFeatureRequestTable"),
    function(m)
      local AppId = generateAppId()
      local user = m.From
      local username = m.Tags.username
      local profileUrl = m.Tags.profileUrl
      AddFeatureRequestTable(AppId, user,profileUrl,username,nil)
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