const fs = require('fs');

function convertQueryStringToJson(queryString) {
  const params = new URLSearchParams(queryString);
  const json = {};

  for (const [key, value] of params.entries()) {
    if (key === 'user') {
      json[key] = JSON.parse(decodeURIComponent(value));
    } else {
      json[key] = value;
    }
  }

  const checkDataString = `auth_date=${json.auth_date}\nquery_id=${
    json.query_id
  }\nuser=${JSON.stringify(json.user)}`;

  const result = {
    auth_date: parseInt(json.auth_date),
    hash: json.hash,
    query_id: json.query_id,
    checkDataString: checkDataString,
    user: {
      id: json.user.id,
      allows_write_to_pm: json.user.allows_write_to_pm,
      first_name: json.user.first_name,
      last_name: json.user.last_name || '',
      username: json.user.username,
      language_code: json.user.language_code,
      version: '7.2', // Assuming fixed version as per your example
      platform: 'android', // Assuming fixed platform as per your example
    },
  };

  return result;
}

const tembak = (token, nonce) => {
  return new Promise((resolve, reject) => {
    const randomtap = Math.floor(Math.random() * 50) + 50;
    fetch('https://api-gw-tg.memefi.club/graphql', {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
        origin: 'https://tg-app.memefi.club',
        'x-requested-with': 'org.telegram.messenger',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://tg-app.memefi.club/game',
        'accept-language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        operationName: 'MutationGameProcessTapsBatch',
        variables: {
          payload: {
            nonce: nonce,
            tapsCount: randomtap,
          },
        },
        query:
          'mutation MutationGameProcessTapsBatch($payload: TelegramGameTapsBatchInput!) {\n  telegramGameProcessTapsBatch(payload: $payload) {\n    ...FragmentBossFightConfig\n    __typename\n  }\n}\n\nfragment FragmentBossFightConfig on TelegramGameConfigOutput {\n  _id\n  coinsAmount\n  currentEnergy\n  maxEnergy\n  weaponLevel\n  energyLimitLevel\n  energyRechargeLevel\n  tapBotLevel\n  currentBoss {\n    _id\n    level\n    currentHealth\n    maxHealth\n    __typename\n  }\n  freeBoosts {\n    _id\n    currentTurboAmount\n    maxTurboAmount\n    turboLastActivatedAt\n    turboAmountLastRechargeDate\n    currentRefillEnergyAmount\n    maxRefillEnergyAmount\n    refillEnergyLastActivatedAt\n    refillEnergyAmountLastRechargeDate\n    __typename\n  }\n  bonusLeaderDamageEndAt\n  bonusLeaderDamageStartAt\n  bonusLeaderDamageMultiplier\n  nonce\n  __typename\n}',
      }),
    })
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err));
  });
};

const login = (hash) => {
  return new Promise((resolve, reject) => {
    fetch('https://api-gw-tg.memefi.club/graphql', {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        origin: 'https://tg-app.memefi.club',
        'x-requested-with': 'org.telegram.messenger',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://tg-app.memefi.club/',
        'accept-language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        operationName: 'MutationTelegramUserLogin',
        variables: {
          webAppData: convertQueryStringToJson(hash),
        },
        query:
          'mutation MutationTelegramUserLogin($webAppData: TelegramWebAppDataInput!) {\n  telegramUserLogin(webAppData: $webAppData) {\n    access_token\n    __typename\n  }\n}',
      }),
    })
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err));
  });
};

const getUserProfile = (token) => {
  return new Promise((resolve, reject) => {
    fetch('https://api-gw-tg.memefi.club/graphql', {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
        origin: 'https://tg-app.memefi.club',
        'x-requested-with': 'org.telegram.messenger',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://tg-app.memefi.club/',
        'accept-language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        operationName: 'QueryTelegramUserMe',
        variables: {},
        query:
          'query QueryTelegramUserMe {\n  telegramUserMe {\n    firstName\n    lastName\n    telegramId\n    username\n    referralCode\n    isDailyRewardClaimed\n    referral {\n      username\n      lastName\n      firstName\n      bossLevel\n      coinsAmount\n      __typename\n    }\n    isReferralInitialJoinBonusAvailable\n    league\n    leagueIsOverTop10k\n    leaguePosition\n    _id\n    __typename\n  }\n}',
      }),
    })
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err));
  });
};

const getGameStatus = (token) => {
  return new Promise((resolve, reject) => {
    fetch('https://api-gw-tg.memefi.club/graphql', {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
        origin: 'https://tg-app.memefi.club',
        'x-requested-with': 'org.telegram.messenger',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://tg-app.memefi.club/game',
        'accept-language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        operationName: 'QUERY_GAME_CONFIG',
        variables: {},
        query:
          'query QUERY_GAME_CONFIG {\n  telegramGameGetConfig {\n    ...FragmentBossFightConfig\n    __typename\n  }\n}\n\nfragment FragmentBossFightConfig on TelegramGameConfigOutput {\n  _id\n  coinsAmount\n  currentEnergy\n  maxEnergy\n  weaponLevel\n  energyLimitLevel\n  energyRechargeLevel\n  tapBotLevel\n  currentBoss {\n    _id\n    level\n    currentHealth\n    maxHealth\n    __typename\n  }\n  freeBoosts {\n    _id\n    currentTurboAmount\n    maxTurboAmount\n    turboLastActivatedAt\n    turboAmountLastRechargeDate\n    currentRefillEnergyAmount\n    maxRefillEnergyAmount\n    refillEnergyLastActivatedAt\n    refillEnergyAmountLastRechargeDate\n    __typename\n  }\n  bonusLeaderDamageEndAt\n  bonusLeaderDamageStartAt\n  bonusLeaderDamageMultiplier\n  nonce\n  __typename\n}',
      }),
    })
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err));
  });
};

const getRecharge = (token) => {
  return new Promise((resolve, reject) => {
    fetch('https://api-gw-tg.memefi.club/graphql', {
      method: 'POST',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 11; Galaxy S7 Build/RQ1A.210105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/83.0.4103.120 Mobile Safari/537.36',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
        origin: 'https://tg-app.memefi.club',
        'x-requested-with': 'org.telegram.messenger',
        'sec-fetch-site': 'same-site',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        referer: 'https://tg-app.memefi.club/boosters',
        'accept-language': 'en,en-US;q=0.9',
      },
      body: JSON.stringify({
        operationName: 'QUERY_GAME_CONFIG',
        variables: {},
        query:
          'query QUERY_GAME_CONFIG {\n  telegramGameGetConfig {\n    ...FragmentBossFightConfig\n    __typename\n  }\n}\n\nfragment FragmentBossFightConfig on TelegramGameConfigOutput {\n  _id\n  coinsAmount\n  currentEnergy\n  maxEnergy\n  weaponLevel\n  energyLimitLevel\n  energyRechargeLevel\n  tapBotLevel\n  currentBoss {\n    _id\n    level\n    currentHealth\n    maxHealth\n    __typename\n  }\n  freeBoosts {\n    _id\n    currentTurboAmount\n    maxTurboAmount\n    turboLastActivatedAt\n    turboAmountLastRechargeDate\n    currentRefillEnergyAmount\n    maxRefillEnergyAmount\n    refillEnergyLastActivatedAt\n    refillEnergyAmountLastRechargeDate\n    __typename\n  }\n  bonusLeaderDamageEndAt\n  bonusLeaderDamageStartAt\n  bonusLeaderDamageMultiplier\n  nonce\n  __typename\n}',
      }),
    })
      .then((res) => resolve(res.json()))
      .catch((err) => reject(err));
  });
};

const main = async () => {
  console.clear();
  const hashlist = fs.readFileSync('hash.txt', 'utf8').split('\n');
  console.log(
    `[${new Date().toLocaleString()}] Total Akun: ${hashlist.length}`
  );
  while (true) {
    for (let i = 0; i < hashlist.length; i++) {
      console.log(
        `\n[${new Date().toLocaleString()}] Mencoba Login ke Akun ke-${i + 1}`
      );
      const hash = hashlist[i].trim();
      const loginres = await login(hash).catch((err) => err);

      if (loginres?.data?.telegramUserLogin?.access_token) {
        console.log(`[${new Date().toLocaleString()}] Berhasil Login`);
        try {
          const token = loginres.data.telegramUserLogin.access_token;
          const userres = await getUserProfile(token);
          const user = userres.data.telegramUserMe;
          console.log(
            `[${new Date().toLocaleString()}] ${user.username} | ${user.league}`
          );
          let nonce = '';
          const gamestatus = await getGameStatus(token);
          if (gamestatus?.data?.telegramGameGetConfig?._id) {
            nonce = gamestatus.data.telegramGameGetConfig.nonce;
          } else {
            console.log(
              `[${new Date().toLocaleString()}] Gagal mendapatkan nonce`
            );
            continue;
          }
          while (true) {
            const restembak = await tembak(token, nonce);
            //   console.log(restembak);
            //   return;
            if (restembak?.data?.telegramGameProcessTapsBatch?._id) {
              let energi =
                restembak.data.telegramGameProcessTapsBatch.currentEnergy;
              console.log(
                `[${new Date().toLocaleString()}] Berhasil Tembak, sisa energi ${energi}`
              );
              const recharge = await getRecharge(token);
              energi = recharge.data.telegramGameGetConfig.currentEnergy;
              if (energi <= 100) {
                console.log(
                  `[${new Date().toLocaleString()}] Energi kurang dari 100, SKIP`
                );

                break;
              }
              nonce = restembak.data.telegramGameProcessTapsBatch.nonce;
              // console.log(restembak);
              //random delay 5 - 10 seconds
              const delay = Math.floor(Math.random() * 5) + 5;
              await new Promise((resolve) => setTimeout(resolve, delay * 1000));
              continue;
            } else {
              break;
            }
          }
        } catch (err) {
          console.log(
            `[${new Date().toLocaleString()}] Gagal Mengambil Data Game`
          );
        }
      } else {
        console.log(`[${new Date().toLocaleString()}] Gagal Login`);
      }
    }
    console.log(
      `\n[${new Date().toLocaleString()}] Semua akun selesai, istrahat 30 menit`
    );
    await new Promise((resolve) => setTimeout(resolve, 60000 * 30));
  }
};

main();
