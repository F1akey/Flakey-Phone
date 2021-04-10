flakey = nil

Citizen.CreateThread(function()
  	while flakey == nil do TriggerEvent('flakey:getSharedObject', function(obj) flakey = obj end) Citizen.Wait(250) end
  	while flakey.GetPlayerData().job == nil do Citizen.Wait(250) end
    flakey.PlayerData = flakey.GetPlayerData()
end)

local phoneOpen = false

RegisterKeyMapping("phone", "Open Phone", "keyboard", "F3")
RegisterCommand("-phone", function() end, false)

RegisterCommand("phone", function()
    enableGui(true)
end, false)

RegisterNUICallback('close', function(data, cb)
    enableGui(false)
    cb(true)
end)

function enableGui(enable)
    if not exports['nxt-inventory']:hasEnoughOfItem('mobilephone', 1) then 
        TriggerEvent("notification", 'You do not have a phone.', 2)
        return 
    end
    phoneOpen = enable
    PhoneAway()
    SetNuiFocus(enable, enable)
    SendNUIMessage({ open = enable })
    while phoneOpen do
        local hr, min = CalculateTimeToDisplay()
        SendNUIMessage({ update = 'Time', time = hr .. ':' .. min })
        CreatePhone()
        PlayPhone()
        Citizen.Wait(1000)
    end
end

function CalculateTimeToDisplay()
    hour, minute = GetClockHours(), GetClockMinutes()  
    if hour <= 9 then hour = "0" .. hour end
    if minute <= 9 then minute = "0" .. minute end
    return hour, minute
end

-- Settings App

RegisterNUICallback('saveSettings', function(data, cb)
    local brightness = tonumber(data.brightness)
    local theme = tonumber(data.theme)
    local notifications = tonumber(data.notifications)
    SetResourceKvpInt('phone-firsttime', 1)
    SetResourceKvpInt('brightness', brightness)
    SetResourceKvpInt('theme', theme)
    SetResourceKvpInt('notifications', notifications)
end)

CreateThread(function()
    Wait(1000)
    if GetResourceKvpInt('phone-firsttime') == 0 then
        SetResourceKvpInt('theme', 1)
        SetResourceKvpInt('brightness', 100)
        SetResourceKvpInt('phone-firsttime', 1)
        SetResourceKvpInt('notifications', 1)
    end
    SendNUIMessage({
        update = 'Settings',
        theme = GetResourceKvpInt('theme'),
        brightness = GetResourceKvpInt('brightness'),
        notifications = GetResourceKvpInt('notifications')
    })
end)

-- Garage App

RegisterNUICallback('getVehicles', function(data, cb)
    flakey.TriggerServerCallback('nxt-phone:getGarageVehicle', function(vehicles)
        array = {}
        for k,v in pairs(vehicles) do
            local vehicle = json.decode(v.vehicle)
            if json.encode(vehicle) ~= "null" then
                table.insert(array, {state = v.vehicle_state, plate = v.plate, garage = v.garage, displayname = GetDisplayNameFromVehicleModel(vehicle["model"])})
            end
        end
        SendNUIMessage({
            update = "Garage",
            vehicles = array,
        })
    end)
end)

-- Animation

local PhoneAnimations = {
	['cellphone@'] = {
		['out'] = { ['text'] = 'cellphone_text_in', ['call'] = 'cellphone_call_listen_base', },
		['text'] = { ['out'] = 'cellphone_text_out', ['text'] = 'cellphone_text_in', ['call'] = 'cellphone_text_to_call', },
		['call'] = { ['out'] = 'cellphone_call_out', ['text'] = 'cellphone_call_to_text', ['call'] = 'cellphone_text_to_call', }
	},
	['anim@cellphone@in_car@ps'] = {
		['out'] = { ['text'] = 'cellphone_text_in', ['call'] = 'cellphone_call_in', },
		['text'] = { ['out'] = 'cellphone_text_out', ['text'] = 'cellphone_text_in', ['call'] = 'cellphone_text_to_call', },
		['call'] = { ['out'] = 'cellphone_horizontal_exit', ['text'] = 'cellphone_call_to_text', ['call'] = 'cellphone_text_to_call', }
	}
}

phoneModel, createdPhone, lastDict = `prop_player_phone_01`, 0

function CreatePhone()
    if createdPhone == 0 and not DoesEntityExist(createdPhone) then
        RequestModel(phoneModel)
        while not HasModelLoaded(phoneModel) do Wait(100) end
        createdPhone = CreateObject(phoneModel, 1.0, 1.0, 1.0, 1, 1, 0)
        local bone = GetPedBoneIndex(PlayerPedId(), 28422)
        AttachEntityToEntity(createdPhone, PlayerPedId(), bone, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 1, 0, 0, 2, 1)
    end
end

function PlayPhone()
    lastDict = "cellphone@"
    if IsPedInAnyVehicle(PlayerPedId(), false) then lastDict = "anim@cellphone@in_car@ps" end
    RequestAnimDict(lastDict) while not HasAnimDictLoaded(lastDict) do Wait(500) end
    lastAnim = PhoneAnimations[lastDict]['out']['text']
    if not IsEntityPlayingAnim(PlayerPedId(), lastDict, lastAnim, 3) then TaskPlayAnim(PlayerPedId(), lastDict, lastAnim, 3.0, -1, -1, 50, 0, false, false, false) end
end

function PhoneAway()
    StopAnimTask(PlayerPedId(), lastDict, lastAnim, 1.0)
    TaskPlayAnim(PlayerPedId(), "cellphone@", "cellphone_call_out", 2.0, 2.0, 800, 49, 0, 0, 0, 0)
    DestoryPhone()
end

function DestoryPhone()
    if DoesEntityExist(createdPhone) then
        DeleteObject(createdPhone)
        createdPhone = 0
    end
end