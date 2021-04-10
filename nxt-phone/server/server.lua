flakey = nil

TriggerEvent('flakey:getSharedObject', function(obj) flakey = obj end)

-- Garage App

flakey.RegisterServerCallback('nxt-phone:getGarageVehicle', function(source, cb)
    local src = source
    local player = flakey.GetPlayerFromId(src)
    MySQL.Async.fetchAll('SELECT plate, vehicle, vehicle_state, garage FROM owned_vehicles WHERE owner = @cid', { ['@cid'] = player.identifier }, function(vehicles)
        cb(vehicles)
    end)
end)

