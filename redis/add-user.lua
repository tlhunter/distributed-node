local LOBBY = KEYS[1] -- Set
local GAME = KEYS[2] -- Hash
local USER_ID = ARGV[1] -- String

redis.call('SADD', LOBBY, USER_ID)

if redis.call('SCARD', LOBBY) == 4 then
  local members = table.concat(redis.call('SMEMBERS', LOBBY), ",")
  redis.call('DEL', LOBBY) -- empty lobby
  local game_id = redis.sha1hex(members)
  redis.call('HSET', GAME, game_id, members)
  return {game_id, members}
end

return nil
