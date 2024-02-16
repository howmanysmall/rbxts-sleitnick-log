--!native
--!optimize 2

-- I advise against using this. It may leak memory.
local RunService = game:GetService("RunService")
local TestService = game:GetService("TestService")
local GcTracker = require(script.Parent:FindFirstChild("GcTracker"))

local function GetService(ServiceName: string)
	return game:GetService(ServiceName)
end

local ServicesMetatable = {}
function ServicesMetatable:__index(Index)
	local Success, Object = pcall(GetService, Index)
	local Service = Success and Object
	self[Index] = Service
	return Service
end

local Services = setmetatable({}, ServicesMetatable)
local Tracker = GcTracker.new()
local CanRun = not script:GetActor()

local Metatable = {}
function Metatable:__index(Path: string): Instance?
	local CurrentObject: Instance? = nil
	for Index, PathValue in string.split(Path, ".") do
		if Index == 1 then
			local Service = Services[PathValue]
			if not Service then
				self[Path] = nil
				return nil
			end

			CurrentObject = Service
		else
			if CurrentObject then
				local Object = CurrentObject:FindFirstChild(PathValue)
				if Object then
					CurrentObject = Object
				end
			end
		end
	end

	if CurrentObject and CanRun then
		Tracker.track(CurrentObject, function()
			self[Path] = nil
		end)
	end

	self[Path] = CurrentObject
	return CurrentObject
end

local GetObjectFromPath = setmetatable({}, Metatable)

local function Concat(...)
	local Length = select("#", ...)
	if Length == 1 then
		return `{...}`
	end

	if Length == 2 then
		local First, Second = ...
		return `{First} {Second}`
	end

	if Length == 3 then
		local First, Second, Third = ...
		return `{First} {Second} {Third}`
	end

	if Length == 4 then
		local First, Second, Third, Fourth = ...
		return `{First} {Second} {Third} {Fourth}`
	end

	local Array = table.create(Length)
	for Index = 1, Length do
		Array[Index] = `{select(Index, ...)}`
	end

	return table.concat(Array, " ")
end

local function InfoLog(...: unknown)
	local SourceModule, Line = debug.info(2, "sl")
	TestService:Message(
		Concat(...),
		if SourceModule then GetObjectFromPath[SourceModule] else "Unknown",
		if Line then Line else -1
	)
end

if CanRun then
	RunService.PostSimulation:Connect(function()
		Tracker.update()
	end)
end

return InfoLog
