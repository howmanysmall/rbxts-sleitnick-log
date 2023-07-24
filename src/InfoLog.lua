-- I advise against using this. It may leak memory.
local TestService = game:GetService("TestService")
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

	if CurrentObject then
		local Connection: RBXScriptConnection?
		Connection = CurrentObject.AncestryChanged:Connect(function()
			if Connection and Connection.Connected then
				Connection:Disconnect()
				Connection = nil
			end

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
		return tostring(...)
	elseif Length == 2 then
		local First, Second = ...
		return `{First} {Second}`
	elseif Length == 3 then
		local First, Second, Third = ...
		return `{First} {Second} {Third}`
	else
		local Array = table.create(Length)
		for Index = 1, Length do
			Array[Index] = tostring(select(Index, ...))
		end

		return table.concat(Array, " ")
	end
end

local function InfoLog(...: unknown)
	local SourceModule, Line = debug.info(2, "sl")
	TestService:Message(Concat(...), GetObjectFromPath[SourceModule], Line)
end

return InfoLog
