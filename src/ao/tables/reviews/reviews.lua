local json = require("json")


-- This process details
PROCESS_NAME = "aos Reviews_Table"
PROCESS_ID = "-E8bZaG3KJMNqwCCcIqFKTVzqNZgXxqX9Q32I_M3-Wo"


-- Main aostore  process details
PROCESS_NAME_MAIN = "aos aostoreP "
PROCESS_ID_MAIN = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"

-- Credentials token
ARS = "8vRoa-BDMWaVzNS-aJPHLk_Noss0-x97j88Q3D4REnE"


AOS_POINTS = "vv8WuNF3bD9MG9tL4zguinQSobFFLDGQJtw_-yyoVl0"

-- tables 
ReviewsTable = ReviewsTable or {}
AosPoints = AosPoints or {}
Transactions = Transactions or {}

-- counters variables
ReviewCounter = ReviewCounter or 0
ReplyCounter = ReplyCounter or 0
TransactionCounter  = TransactionCounter or 0



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



function GenerateRatingsChart(ratingsTableEntry)
    -- Initialize a table to store the ratings count
    local ratingsData = { [1] = 0, [2] = 0, [3] = 0, [4] = 0, [5] = 0 }

    -- Ensure countHistory exists and process it
    if ratingsTableEntry and ratingsTableEntry.countHistory then
        for _, record in ipairs(ratingsTableEntry.countHistory) do
            -- Validate and update ratings
            local rating = record.rating
            if ratingsData[rating] ~= nil then
                ratingsData[rating] = ratingsData[rating] + 1
            else
                print("Invalid rating found:", rating)
            end
        end
    else
        print("Invalid or missing countHistory in ratingsTableEntry")
    end

    return ratingsData
end
 

-- Function to get the current time in milliseconds
function GetCurrentTime(msg)
    return msg.Timestamp -- returns time in milliseconds
end


-- Function to generate a unique review ID
function GenerateReviewId()
    ReviewCounter = ReviewCounter + 1
    return "RW" .. tostring(ReviewCounter)
end

-- Function to generate a unique transaction ID
function GenerateTransactionId()
    TransactionCounter = TransactionCounter + 1
    return "TX" .. tostring(TransactionCounter)
end


-- Function to generate a unique transaction ID
function GenerateReplyId()
    ReplyCounter = ReplyCounter + 1
    return "RX" .. tostring(ReplyCounter)
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


function DetermineUserRank(user, appId, providedRank)
    
    -- Get app data with safety checks
    local appData = ReviewsTable[appId] or {}
    local owner = appData.owner
    local mods = appData.mods or {}

    -- Determine rank priority
    if user == owner then
        return "Architect" -- Highest priority
    elseif mods[user] then
        return "Agent"     -- Secondary priority
    else
        return providedRank -- Default/fallback rank
    end
end



Handlers.add(
    "AddReviewTableY",
    Handlers.utils.hasMatchingTag("Action", "AddReviewTableY"),
    function(m)
        local currentTime = m.Tags.currentTime
        local reviewId = GenerateReviewId()
        local replyId = GenerateReplyId()
        local appId = m.Tags.appId
        local user  = m.Tags.user
        local profileUrl = m.Tags.profileUrl
        local username = m.Tags.username
        local caller = m.From
        
        print("Here is the caller Process ID"..caller)
        

        -- Field validation examples
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(user, "user", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        
        -- Ensure global tables are initialized
        ReviewsTable = ReviewsTable or {}
        AosPoints = AosPoints or {}

        -- Create the review table for this appId
        ReviewsTable[appId] = {
            appId = appId,
            status = false,
            owner = user,
            mods = { [user] = { permissions = { replyReview = true }, time = currentTime } },
            reviews = {
                [reviewId] = {
                    reviewId = reviewId,
                    user = user,
                    username = username,
                    description = "Great app!",
                    profileUrl = profileUrl,
                    edited = false,
                    rating = 5,
                    rank = "Architect",
                   createdTime = currentTime,
                    voters = {
                        foundHelpful = { 
                            count = 1,
                            countHistory = { { time = currentTime, count = 1 } },
                            users = { [user] = {voted = true, time = currentTime } }
                        },
                        foundUnhelpful = { 
                            count = 0,
                            countHistory = { { time = currentTime, count = 0 } },
                            users = { [user] = {voted = false, time = currentTime } }
                        }
                    },
                    replies = {
                        [replyId] = {
                            replyId = replyId,
                            user = user,
                            username = username,
                            description = "Thank you for your feedback!",
                           createdTime = currentTime,
                            edited = false,
                            rank = "Architect",
                            voters = {
                                foundHelpful = { 
                            count = 1,
                            countHistory = { { time = currentTime, count = 1 } },
                            users = { [user] = {voted = true, time = currentTime } }
},
                                foundUnhelpful = { 
                            count = 0,
                            countHistory = { { time = currentTime, count = 0 } },
                            users = { [user] = {voted = false, time = currentTime } }
                        }
                    },
                        }
                    }
                }
            },
            ratings = { 
                        count = 1,
                        totalRatings = 5,
                        countHistory = { { time = currentTime, count = 1 , rating = 5 } },
                        users = { [user] = {rated = true, time = currentTime } }
                    }, 
            count = 1,
            countHistory = { { time = currentTime, count = 1 } },
            users = { [user] = { reviewed = true, time = currentTime } }
        }

        -- Create the AosPoints table for this appId
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
        
        ReviewsTable[#ReviewsTable + 1] = {
            ReviewsTable[appId]
        }

        AosPoints[#AosPoints + 1] = {
            AosPoints[appId]
        }


        local transactionType = "Project Creation."
        local amount = 0
        local points = 5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

        ReviewsTable[appId].status = true
        AosPoints[appId].status = true

        local status = true
        -- Send responses back
        ao.send({
            Target = ARS,
            Action = "ReviewsRespons",
            Data = tostring(status)
        })
        print("Successfully Added Review table")
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


        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(owner, "owner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        if ARS ~= caller then
            SendFailure(m.From, "Only the Main process can call this handler.")
            return
        end
        
        -- Ensure appId exists in ReviewsTable
        if ReviewsTable[appId] == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        -- Check if the user making the request is the current owner
        if ReviewsTable[appId].owner ~= owner then
            SendFailure(m.From, "You are not the Owner of the App.")
            return
        end
        
        local transactionType = "Deleted Project."
        local amount = 0
        local points = 0
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
        ReviewsTable[appId] = nil
        print("Sucessfully Deleted App" )

    end
)


Handlers.add(
    "FetchAppRatings",
    Handlers.utils.hasMatchingTag("Action", "FetchAppRatings"),
    function(m)

        local appId = m.Tags.appId


        if not ValidateField(appId, "appId", m.From) then return end

        
        -- Ensure appId exists in ReviewsTable
        if ReviewsTable[appId].ratings == nil then
            SendFailure(m.From ,"App doesnt exist for  specified " )
            return
        end

        local ratingsData = ReviewsTable[appId].ratings
        
        local ratingsInfo  = GenerateRatingsChart(ratingsData)

       SendSuccess(m.From , ratingsInfo)

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
        
        -- Ensure appId exists in ReviewsTable
        if ReviewsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(newOwner, "newOwner", m.From) then return end
        if not ValidateField(currentOwner, "currentOwner", m.From) then return end
        if not ValidateField(currentTime, "currentTime", m.From) then return end

        -- Check if the user making the request is the current owner
        if ReviewsTable[appId].owner ~= currentOwner then
            SendFailure(m.From , "You are not the owner of this app.")
            return
        end

        -- Transfer ownership
        ReviewsTable[appId].owner = newOwner
        ReviewsTable[appId].mods[currentOwner] = newOwner

        local transactionType = "Transfered app succesfully."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
    end
)


Handlers.add(
    "FetchAppReviews",
    Handlers.utils.hasMatchingTag("Action", "FetchAppReviews"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
         if ReviewsTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end
        -- Fetch the info
        local appReviews = ReviewsTable[appId].reviews
        SendSuccess(m.From , appReviews)
    end
)


Handlers.add(
    "FetchAppReviewsInfo",
    Handlers.utils.hasMatchingTag("Action", "FetchAppReviewsInfo"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
         if ReviewsTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end

        local reviewsCount = ReviewsTable[appId].count

        local ratingsCount = ReviewsTable[appId].ratings.count

        local totalRatings = ReviewsTable[appId].ratings.totalRatings
        -- Fetch the info
        local reviewInfo = { reviewsCount = reviewsCount,ratingsCount = ratingsCount, totalRatings = totalRatings}

        SendSuccess(m.From , reviewInfo)
    end
)


Handlers.add(
    "FetchAppReviewsCount",
    Handlers.utils.hasMatchingTag("Action", "FetchAppReviewsCount"),
    function(m)
        local appId = m.Tags.appId

         if not ValidateField(appId, "appId", m.From) then return end

        -- Ensure appId exists in ReviewsTable
         if ReviewsTable[appId] == nil then
             SendFailure(m.From , "App not Found.")
            return
        end

        local reviewsCount = ReviewsTable[appId].count or 0


        SendSuccess(m.From , reviewsCount)
    end
)



Handlers.add(
    "AddReviewAppX",
    Handlers.utils.hasMatchingTag("Action", "AddReviewAppX"),
    function(m)

        local appId = m.Tags.appId
        local user = m.From
        local username = m.Tags.username
        local profileUrl = m.Tags.profileUrl
        local reviewId = GenerateReviewId()
        local currentTime = GetCurrentTime(m)
        local description = m.Tags.description
        local rating = tonumber(m.Tags.rating)
        local providedRank = m.Tags.rank
    

        -- Ensure appId exists in ReviewsTable
        if ReviewsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId..")
            return
        end

        if not ValidateField(rating, "rating", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end

        -- Validate rating
        if rating < 1 or rating > 5 then
            SendFailure(m.From, "Invalid rating. Please provide a rating between 1 and 5.")
            return
        end

        -- Get or initialize the app entry in the target table
        local targetEntry = ReviewsTable[appId]

        if targetEntry.users[user] then
            SendFailure(m.From , "You have already Reviewed this project.")
             return
        end

        -- Add user and update count
        targetEntry.users[user] = { reviewed = true, time = currentTime }
        targetEntry.count = targetEntry.count + 1
        
        targetEntry.countHistory[#targetEntry.countHistory + 1] = { time = currentTime, count = targetEntry.count }
        
       
        local finalRank = DetermineUserRank(m.From, appId, providedRank)
        
        local voters = {
            foundHelpful = {
                count = 0,
                countHistory = {},
                users = {}
            },
            foundUnhelpful = {
                count = 0,
                countHistory = {},
                users = {}
            }
        }
        -- Add the new entry
        ReviewsTable[appId].reviews[reviewId] = {
            reviewId = reviewId ,
            user = user,
            username = username,
            rating = rating,
            edited = false,
            rank = finalRank,
            description = description,
           createdTime = currentTime,
            profileUrl = profileUrl,
            replies = {},
            voters = voters
        }

        -- Add user and update count
        targetEntry.ratings[user] = { rated = true, time = currentTime }
        targetEntry.ratings.count = targetEntry.ratings.count + 1

        targetEntry.ratings.countHistory[#targetEntry.ratings.countHistory + 1] = { time = currentTime, count = targetEntry.count , rating = rating}
        targetEntry.ratings.totalRatings = targetEntry.ratings.totalRatings + rating

        local transactionType = "Added A review."
        local amount = 0
        local points = 10
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)

        local reviewInfo =  ReviewsTable[appId].reviews[reviewId]
        SendSuccess(m.From , reviewInfo)      
  end
)





Handlers.add(
    "AddReviewReply",
    Handlers.utils.hasMatchingTag("Action", "AddReviewReply"),
    function(m)

        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local username = m.Tags.username
        local description = m.Tags.description
        local profileUrl = m.Tags.profileUrl
        local user = m.From
        local currentTime = GetCurrentTime(m)
        local replyId = GenerateReplyId()
        local providedRank = m.Tags.rank
        

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(username, "username", m.From) then return end
        if not ValidateField(profileUrl, "profileUrl", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end

        -- Ensure appId exists in ReviewsTable
        if ReviewsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        -- Check if the user is the app owner
        if ReviewsTable[appId].owner ~= user or ReviewsTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can reply to bug reports.")
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end


        local targetReview =  ReviewsTable[appId].reviews[reviewId]

        -- Check if the user has already replied to this review
        if targetReview.replies then
            for _, reply in ipairs(targetReview.replies) do
                if reply.user == user then
                    SendFailure(m.From, "You have already replied to this bug report.")
                    return
                end
            end
        else
            targetReview.replies = {} -- Initialize replies table if not present
        end
        -- Check if the user has already replied to this bug report
      
        local finalRank = DetermineUserRank(m.From,appId, providedRank)


         local voters = {
            foundHelpful = {
                count = 0,
                countHistory = {},
                users = {}
            },
            foundUnhelpful = {
                count = 0,
                countHistory = {},
                users = {}
            }
        }

        ReviewsTable[appId].reviews[reviewId].replies[replyId] =  {
            replyId = replyId,
            user = user,
            profileUrl = profileUrl,
            rank = finalRank,
            edited = false,
            username = username,
            description = description,
            createdTime = currentTime,
           voters = voters 
        }
        
        local transactionType = "Replied to a review."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)
         local reviewInfo =  ReviewsTable[appId].reviews[reviewId]
        SendSuccess(m.From , reviewInfo)
         end
)


Handlers.add(
    "EditReview",
    Handlers.utils.hasMatchingTag("Action", "EditReview"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime
        local description = m.Tags.description
        local rating = tonumber(m.Tags.rating)
        local providedRank = m.Tags.rank
        
        if not ValidateField(rating, "rating", m.From) then return end
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end
        if not ValidateField(providedRank, "providedRank", m.From) then return end

        if rating < 1 or rating > 5 then
            SendFailure(m.From, "Invalid rating. Please provide a rating between 1 and 5.")
            return
        end

        if not ReviewsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end

        local review =  ReviewsTable[appId].reviews[reviewId]

        if not review.user ~= user then
            SendFailure(m.From, "Only the owner can Edit A review")
        end
        
        local finalRank = DetermineUserRank(m.From,appId, providedRank)

        local targetEntry = ReviewsTable[appId]

 
        targetEntry.ratings.totalRatings = targetEntry.ratings.totalRatings + rating - review.rating

        review.rating = rating
        review.rank = finalRank
        review.description = description
        review.edited = true
        review.currentTime = currentTime

        
       
        local transactionType = "Edited Review Succesfully."
        local amount = 0
        local points = -5
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Review Edited Succesfully." )   
    end
)


Handlers.add(
    "DeleteReview",
    Handlers.utils.hasMatchingTag("Action", "DeleteReview"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime
     
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end
      

        if not ReviewsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end

        local review =  ReviewsTable[appId].reviews[reviewId]

        if not review.user ~= user then
            SendFailure(m.From, "Only the owner can Delete the review")
        end

        local targetEntry = ReviewsTable[appId]
        
        -- Reviews Effect.

        targetEntry.users[user] = nil
        targetEntry.count = targetEntry.count - 1
        
        targetEntry.countHistory[#targetEntry.countHistory + 1] = { time = currentTime, count = targetEntry.count }
        

        --Ratings Effect.
        targetEntry.ratings.totalRatings = targetEntry.ratings.totalRatings - review.rating
        targetEntry.ratings.count = targetEntry.ratings.count - 1
        targetEntry.ratings.countHistory[#targetEntry.ratings.countHistory + 1] = { time = currentTime, count = targetEntry.count }

       

        local transactionType = "Deleted Review Succesfully."
        local amount = 0
        local points = -10
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        review = nil
        SendSuccess(m.From , "Review Edited Succesfully." )   
    end
)



Handlers.add(
    "MarkUnhelpfulReview",
    Handlers.utils.hasMatchingTag("Action", "MarkUnhelpfulReview"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime

        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end

        if ReviewsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end

        local review =  ReviewsTable[appId].reviews[reviewId]

        local unhelpfulData = review.voters.foundUnhelpful
        local helpfulData = review.voters.foundHelpful

        if unhelpfulData.users[user] then
            SendFailure(m.From, "You have already marked this review as unhelpful.")
            return
        end

        if helpfulData.users[user] then
            helpfulData.users[user] = nil
            helpfulData.count = helpfulData.count - 1

            helpfulData.countHistory[#helpfulData.countHistory + 1] = { time = currentTime, count = helpfulData.count }
            
            local transactionType = "Switched vote to unhelpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        end

        unhelpfulData.users[user] = { voted = true, time = currentTime }
        unhelpfulData.count = unhelpfulData.count + 1

        unhelpfulData.countHistory[#unhelpfulData.countHistory + 1] = { time = currentTime, count = unhelpfulData.count }

        local transactionType = "Marked Review Unhelpful."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked Review Unhelpful")
        end
)

Handlers.add(
    "MarkHelpfulReview",
    Handlers.utils.hasMatchingTag("Action", "MarkHelpfulReview"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime
    

        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end


        if not ReviewsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end

        local review =  ReviewsTable[appId].reviews[reviewId]

        local helpfulData = review.voters.foundHelpful
       
        local unhelpfulData = review.voters.foundUnhelpful
        
        if helpfulData.users[user] then
            SendFailure(m.From , "You already marked this review as helpful.")
            return
        end

        if unhelpfulData.users[user] then
            unhelpfulData.users[user] = nil
            unhelpfulData.count = unhelpfulData.count - 1

            unhelpfulData.countHistory[#unhelpfulData.countHistory + 1] = { time = currentTime, count = unhelpfulData.count }
            
            local transactionType = "Switched vote to helpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
       
        end

        helpfulData.users[user] = {voted = true, time = currentTime }
        helpfulData.count = helpfulData.count + 1
        helpfulData.countHistory[#helpfulData.countHistory + 1] = { time = currentTime, count =helpfulData.count }
        local transactionType = "Marked review Helpful"
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked the Review Helpful Succesfully" )   
    end
)


Handlers.add(
    "MarkUnhelpfulReviewReply",
    Handlers.utils.hasMatchingTag("Action", "MarkUnhelpfulReviewReply"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime
    
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if ReviewsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified AppId..")
            return
        end

        if ReviewsTable[appId].reviews[reviewId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local review =  ReviewsTable[appId].reviews[reviewId].replies[replyId]

        local unhelpfulData = review.voters.foundUnhelpful
        local helpfulData = review.voters.foundHelpful

        if unhelpfulData.users[user].voted then
            SendFailure(m.From, "You have already marked this review as unhelpful.")
            return
        end

        if helpfulData.users[user].voted then
            helpfulData.users[user] = nil
            helpfulData.count = helpfulData.count - 1

            helpfulData.countHistory[#helpfulData.countHistory + 1] = { time = currentTime, count = helpfulData.count }
            
            local transactionType = "Switched vote to unhelpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        end

        unhelpfulData.users[user] = { voted = true, time = currentTime }
        unhelpfulData.count = unhelpfulData.count + 1

        unhelpfulData.countHistory[#unhelpfulData.countHistory + 1] = { time = currentTime, count = unhelpfulData.count }

        local transactionType = "Marked Review Unhelpful."
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked Review Unhelpful")
        end
)


Handlers.add(
    "MarkHelpfulReviewReply",
    Handlers.utils.hasMatchingTag("Action", "MarkHelpfulReviewReply"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime

        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if not ReviewsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end

        if ReviewsTable[appId].reviews[reviewId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local review =  ReviewsTable[appId].reviews[reviewId].replies[replyId] 

        local helpfulData = review.voters.foundHelpful
       
        local unhelpfulData = review.voters.foundUnhelpful
        
        if helpfulData.users[user].voted then
            SendFailure(m.From , "You already marked this review as helpful.")
            return
        end

        if unhelpfulData.users[user] then
            unhelpfulData.users[user] = nil
            unhelpfulData.count = unhelpfulData.count - 1

            unhelpfulData.countHistory[#unhelpfulData.countHistory + 1] = { time = currentTime, count = unhelpfulData.count }
            
            local transactionType = "Switched vote to helpful."
            local amount = 0
            local points = -5
            LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
    
        end

        helpfulData.users[user] = { voted = true, time = currentTime }
        helpfulData.count = helpfulData.count + 1
        helpfulData.countHistory[#helpfulData.countHistory + 1] = { time = currentTime, count =helpfulData.count }
        local transactionType = "Marked reply Helpful"
        local amount = 0
        local points = 3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Marked the reply as Helpful Succesfully" )   
    end
)


Handlers.add(
    "EditReviewReply",
    Handlers.utils.hasMatchingTag("Action", "EditReviewReply"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime
        local description = m.Tags.description
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end
        if not ValidateField(description, "description", m.From) then return end

        if not ReviewsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end

        if ReviewsTable[appId].reviews[reviewId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local reply =  ReviewsTable[appId].reviews[reviewId].replies[replyId] 

        if not reply.user ~= user or ReviewsTable[appId].owner ~= user or ReviewsTable[appId].mod[user] ~= user then
            SendFailure(m.From, "Only the owner , mod or other mods can edit a reply. ")
        end

        reply.description = description
        reply.edited = true
        local transactionType = "Edited Reply.."
        local amount = 0
        local points = -3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        SendSuccess(m.From , "Edited Reply Succesfully." )   
    end
)


Handlers.add(
    "DeleteReviewReply",
    Handlers.utils.hasMatchingTag("Action", "DeleteReviewReply"),
    function(m)
        local appId = m.Tags.appId
        local reviewId = m.Tags.reviewId
        local replyId = m.Tags.replyId
        local user = m.From
        local currentTime = GetCurrentTime(m) -- Ensure you have a function to get the currentcreatedTime
        
        if not ValidateField(appId, "appId", m.From) then return end
        if not ValidateField(reviewId, "reviewId", m.From) then return end
        if not ValidateField(replyId, "replyId", m.From) then return end

        if not ReviewsTable[appId] then
            SendFailure(m.From, "App not found...")
            return
        end

        if ReviewsTable[appId].reviews[reviewId] == nil then
            SendFailure(m.From, "review doesnt exist for  specified AppId..")
            return
        end

        if ReviewsTable[appId].reviews[reviewId].replies[replyId] == nil then
            SendFailure(m.From, "replyId doesnt exist for  specified AppId..")
            return
        end

        local reply =  ReviewsTable[appId].reviews[reviewId].replies[replyId] 

        if not reply.user ~= user or ReviewsTable[appId].owner ~= user then
            SendFailure(m.From, "Only the owner , mod or other mods can edit a reply. ")
        end

        
        local transactionType = "Deleted  Reply.."
        local amount = 0
        local points = -3
        LogTransaction(m.From, appId, transactionType, amount, currentTime, points)  
        reply = nil
        SendSuccess(m.From , "Deleted Reply. " )   
    end
)




Handlers.add(
    "AddModerator",
    Handlers.utils.hasMatchingTag("Action", "AddModerator"),
    function(m)
        local appId = m.Tags.appId
        local mods = json.decode(m.Tags.mods) 
        local user = m.From
        local currentTime = GetCurrentTime(m)


        -- Validation
        if not ValidateField(appId, "appId", user) then return end
        if not ValidateField(mods, "mods", user) then return end

        -- Check app existence
        if not ReviewsTable[appId] then
            return SendFailure(user, "App not found")
        end

        -- Authorization check
        if ReviewsTable[appId].owner ~= user then
            return SendFailure(user, "Only owner can add moderators")
        end

        local app = ReviewsTable[appId]

        -- Initialize mods table if not exists
        app.mods = app.mods or {}

        for _, modId in ipairs(mods) do
            -- Check if user exists in regular users or mods
            if app.mods[modId] then
                print("modId exists in the list")
            else
                -- Add as mod with permissions
                app.mods[modId] = {
                    permissions = { replyReview = true },
                    time = currentTime
                }
            end
        end

        local points = 3
        LogTransaction(user, appId, "Added Moderators", 0, currentTime, points)

        local modsInfo = ReviewsTable[appId].mods
        SendSuccess(user, modsInfo)
    end
)

Handlers.add(
    "RemoveModerator",
    Handlers.utils.hasMatchingTag("Action", "RemoveModerator"),
    function(m)
        local appId = m.Tags.appId
        local modId = m.Tags.modId
        local user = m.From
        local currentTime = GetCurrentTime(m)

        -- Validate inputs
        if not ValidateField(appId, "appId", user) then return end
        if not ValidateField(modId, "modId", user) then return end

        -- Check app existence
        if not ReviewsTable[appId] then
            return SendFailure(user, "App not found")
        end

        local app = ReviewsTable[appId]

        -- Authorization check
        if app.owner ~= user then
            return SendFailure(user, "Only owner can remove moderators")
        end

        -- Check mod existence using correct structure
        if not app.mods or not app.mods[modId] then
            return SendFailure(user, "Moderator not found")
        end

        -- Remove mod
        app.mods[modId] = nil

        -- Update transaction log
        LogTransaction(user, appId, "Removed Moderator", 0, currentTime, 2)

        local modlists =  ReviewsTable[appId].mods
        -- Return updated mod list
        SendSuccess(user, modlists)
    end
)

Handlers.add(
    "FetchModsLists",
    Handlers.utils.hasMatchingTag("Action", "FetchModsLists"),
    function(m)

        local appId = m.Tags.appId
        local user = m.From

        if not ValidateField(appId, "appId", m.From) then return end

         -- Ensure appId exists in ReviewsTable
        if ReviewsTable[appId] == nil then
            SendFailure(m.From, "App doesnt exist for  specified appId ")
            return
        end
        
         -- Check if the user is the app owner
        if ReviewsTable[appId].owner ~= user or ReviewsTable[appId].mods[user] ~= user then
            SendFailure(m.From, "Only the app owner or Mods can view modlists.")
        end


        local modlists =  ReviewsTable[appId].mods

        SendSuccess(user,modlists)
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
            Action = "ReviewsAosRespons",
            Data = TableToJson(aosPointsData)
        })
        -- Send success response
        print("Successfully Sent reviews handler aosPoints table")
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
    "ClearReviews",
    Handlers.utils.hasMatchingTag("Action", "ClearReviews"),
    function(m)
        ReviewsTable = {}
    end
)


Handlers.add(
    "ClearData",
    Handlers.utils.hasMatchingTag("Action", "ClearData"),
    function(m)

        if m.From == ao.id then
             ReviewsTable = {}
            AosPoints =  {}
            Transactions = Transactions or {}
            ReviewCounter = 0
            TransactionCounter = 0
            ReplyCounter = 0
            SendSuccess(m.From , "Succesfully deleted project")
        else
        SendFailure(m.From, "You do not have any transactions")
        end
    end
)




