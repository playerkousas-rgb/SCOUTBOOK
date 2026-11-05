// ==========================================================================
// SCOUTBOOK — shared/syllabus.js（自動生成，請勿手改）
// 生成指令：node scripts/build_syllabus.mjs <scoutbadge>/data/items.json
// 單一真相：scoutbadge · data/items.json（sha256 2ece8159f75e3441…）
// BOOK 內部鍵即官方編號原文（L1-M1…L5-*、SC-*-*），零映射。
// 官方中文原文為準；英文為工作譯本。
// ==========================================================================

export const SYLLABUS_META = {
  "version": "1.0.0",
  "app": "SCOUTBOOK",
  "scheme": "童軍訓練綱要",
  "schemeEdition": "Scout branch 2026 revision catalogue 2026-09",
  "effectiveDate": "2026-08-15",
  "badgeSource": "scoutbadge · data/items.json",
  "badgeSourceSha256": "2ece8159f75e3441824314a8988d1474d4e783411a0ba7dc48c1e4b0f4aecf30",
  "itemCount": 75,
  "otherBadgeCount": 143,
  "enCoverage": {
    "progress": "75/75",
    "otherBadges": "143/143"
  },
  "note": "BOOK 內部鍵即 scoutbadge 官方編號原文（L1-M1…L5-*、SC-*-*），零映射、零改名。官方中文原文為準，英文為工作譯本。"
};

/** 進度性獎章：會員章 → 探索 → 標準 → 高級 → 總領袖獎章 */
export const BADGE_SYLLABUS = [
  {
    "id": "L1",
    "badgeKey": "L1",
    "icon": "⚜️",
    "name": "會員章",
    "en": "Membership Badge",
    "color": "#2E7D32",
    "purpose": "幫助新成員認識童軍運動、誓詞規律銘言、小隊制度及國民身份",
    "purposeEn": "Help new members know the Scout Movement, the Promise, Law and Motto, the Patrol System and national identity",
    "description": "適合年滿十一歲之童軍成員；完成全部十一項後由團長簽發",
    "descriptionEn": "For Scouts aged 11 or above; issued by the Scout Leader after completing all eleven items",
    "itemLabel": "進度項目",
    "itemLabelEn": "Progress Items",
    "segments": [
      {
        "code": "L1-M",
        "name": "會員章項目",
        "en": "Membership Badge Items",
        "items": [
          {
            "id": "L1-M1",
            "badgeId": "L1-M1",
            "name": "加入安排",
            "en": "Joining Arrangements",
            "detail": "與你的小隊長商議有關加入童軍團之安排。",
            "detailEn": "Join the Scout Group and complete the joining arrangements with the Section Leader.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M2",
            "badgeId": "L1-M2",
            "name": "加入小隊",
            "en": "Join the Patrol",
            "detail": "加入一小隊及從小隊活動中認識隊中其他成員。",
            "detailEn": "Join a patrol and know your patrol duties.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M3",
            "badgeId": "L1-M3",
            "name": "團集會出席",
            "en": "Meeting Attendance",
            "detail": "最少參加六次團集會／活動，其中一次應在戶外舉行。",
            "detailEn": "Attend Group meetings regularly; absence requires leave and reasonable excuse.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M4",
            "badgeId": "L1-M4",
            "name": "認識童軍運動",
            "en": "Know the Scout Movement",
            "detail": "對世界及香港童軍運動之發展有普遍的認識。",
            "detailEn": "Know the Scout Movement, the Association and the Sections (Beaver to Rover) and the Scout promise, law and motto basics.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M5",
            "badgeId": "L1-M5",
            "name": "誓詞、規律及銘言",
            "en": "Promise, Law and Motto",
            "detail": "明瞭及接納童軍誓詞、規律和銘言。",
            "detailEn": "Recite and understand the Promise, Law and Motto; know the meaning of \"Be Prepared\".",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M6",
            "badgeId": "L1-M6",
            "name": "宣誓禮儀及中式隊列",
            "en": "Ceremonial Protocol and Chinese-style Drill",
            "detail": "認識宣誓時應有之童軍禮儀，以及中式隊列之基本動作。",
            "detailEn": "Know the investiture and flag ceremony procedures and basic Chinese-style ceremonial drill.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M7",
            "badgeId": "L1-M7",
            "name": "國旗及國徽",
            "en": "National Flag and Emblem",
            "detail": "能辨認中華人民共和國國旗和國徽，並說明其含意。",
            "detailEn": "Know the national flag and national emblem: history, meaning, display and protection rules.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M8",
            "badgeId": "L1-M8",
            "name": "區旗及區徽",
            "en": "Regional Flag and Emblem",
            "detail": "能辨認香港特別行政區區旗和區徽，並說明其含意。",
            "detailEn": "Know the regional flag and emblem: design meaning, display and protection rules.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M9",
            "badgeId": "L1-M9",
            "name": "升旗禮儀及程序",
            "en": "Flag-raising Protocol",
            "detail": "認識國歌奏唱和升掛國旗、區旗時應有之禮儀，以及升國旗的基本程序。",
            "detailEn": "Know the flag-raising ceremony: roles, procedure and etiquette.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M10",
            "badgeId": "L1-M10",
            "name": "國歌",
            "en": "National Anthem",
            "detail": "明瞭設立國歌的用意，並能背唱之。",
            "detailEn": "Sing the national anthem and know its history and etiquette.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          },
          {
            "id": "L1-M11",
            "badgeId": "L1-M11",
            "name": "保護兒童免受侵害",
            "en": "Child Protection",
            "detail": "認識常見兒童侵害情況、預防方法及處理方法（Safe from Harm）。",
            "detailEn": "Know child abuse types, how to stay safe and report concerns (call 1878 8988); complete a related creative task.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Intro/MembershipBadge.pdf"
          }
        ]
      }
    ]
  },
  {
    "id": "L2",
    "badgeKey": "L2",
    "icon": "🧭",
    "name": "童軍探索獎章",
    "en": "Scout Pathfinder Award",
    "color": "#33691E",
    "purpose": "經歷體驗，獲取成功感；建議約六個月完成",
    "purposeEn": "Experience and exposure; gain a sense of success; about six months",
    "description": "適合年滿十一歲而考獲會員章之童軍成員。選修須在戶外／海上／航空活動三選一（各進度性獎章選項須相同；海童軍必選海上、空童軍必選航空），並在社區認識／生態環境／氣象三選一。",
    "descriptionEn": "For Scouts aged 11+ who hold the Membership Badge. Choose ONE of Outdoor/Sea/Air (same option across all progressive awards; Sea Scouts must choose Sea, Air Scouts Air), and ONE of Community/Ecology/Meteorology.",
    "itemLabel": "進度項目",
    "itemLabelEn": "Progress Items",
    "segments": [
      {
        "code": "L2-A",
        "name": "A 戶外挑戰",
        "en": "A Outdoor Challenge",
        "items": [
          {
            "id": "L2-A1",
            "badgeId": "L2-A1",
            "name": "A1 營藝",
            "en": "A1 Camping",
            "detail": "參與一次小隊、團或旅的露營活動，學習與小隊隊員相處及分工合作；指出露營所需個人物資及數量並收拾露營背囊；安全使用營燈、爐具、手鎚及小刀等有潛在危險工具；清潔、整理及存放個人及小隊露營物品。",
            "detailEn": "Camping skills: campsite choice, hygiene, constructions, equipment and cooking; plan and run a camp.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-A2",
            "badgeId": "L2-A2",
            "name": "A2 歷險",
            "en": "A2 Adventure",
            "detail": "分辨地圖種類及用途並指出十種習用圖例；收拾一日郊野旅程背囊；與小隊隊員進行一日或不少於五公里徒步，或不少於十公里單車／獨木舟／風帆／船艇之郊野旅程。",
            "detailEn": "Adventure journey: plan and complete a hike/journey with route, safety and emergency planning.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-A3",
            "badgeId": "L2-A3",
            "name": "A3 先鋒工程",
            "en": "A3 Pioneering",
            "detail": "示範及指出平結、八字結、雙套結、半結、反手結、稱人結、接繩結、繫木結、縮繩結及曳木結之結法及用途；示範收繩方法並指出妥善收藏繩索的重要性。",
            "detailEn": "Pioneering: ropes and lashings; build a pioneering project with the patrol.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-A4",
            "badgeId": "L2-A4",
            "name": "A4 戶外活動（選修）",
            "en": "A4 Outdoor Activities (elective)",
            "detail": "明瞭戶外活動安全指引及郊野守則；參與追蹤符號應用、公園定向或使用密碼通訊其中一項活動。（三選一，各獎章選項須相同）",
            "detailEn": "One elective outdoor option (hiking, cycling, riding or traditional games): train, take part, keep a record; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-A5",
            "badgeId": "L2-A5",
            "name": "A5 海上活動（選修）",
            "en": "A5 Sea Activities (elective)",
            "detail": "明瞭海上活動安全守則；通過本會游泳測試。（海童軍必選此項）",
            "detailEn": "One elective sea option (canoeing, rowing, sailing, windsurfing): train and take part; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-A6",
            "badgeId": "L2-A6",
            "name": "A6 航空活動（選修）",
            "en": "A6 Air Activities (elective)",
            "detail": "明瞭旅客在機場及航機內一般航空安全守則；完成航空相關戶外活動、說出現代飛機主要部分及名稱，或辨認初級航空章課程內四種飛行器其中一項。（空童軍必選此項）",
            "detailEn": "One elective air option (model flight or air visit) or hold the relevant air badge; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          }
        ]
      },
      {
        "code": "L2-B",
        "name": "B 個人發展",
        "en": "B Personal Development",
        "items": [
          {
            "id": "L2-B1",
            "badgeId": "L2-B1",
            "name": "B1 身心健康",
            "en": "B1 Physical and Mental Well-being",
            "detail": "參與一次以運動或體能競技為主題的小隊活動。",
            "detailEn": "Physical and mental well-being: first aid, fitness training, mental-health knowledge and activities.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-B2",
            "badgeId": "L2-B2",
            "name": "B2 科學、科技、工程、藝術、數學及創意",
            "en": "B2 STEAM and Creativity",
            "detail": "認識所屬小隊歡呼，並於活動中吶喊以增強小隊士氣。",
            "detailEn": "STEAM and creativity: complete a project combining these fields with creativity.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          }
        ]
      },
      {
        "code": "L2-C",
        "name": "C 領導才與靈性發展",
        "en": "C Leadership and Spiritual Development",
        "items": [
          {
            "id": "L2-C1",
            "badgeId": "L2-C1",
            "name": "C1 領導才",
            "en": "C1 Leadership",
            "detail": "參與一次小隊會議，並指出召開小隊會議的目的。",
            "detailEn": "Leadership: patrol leadership roles, meeting skills and a leadership project.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-C2",
            "badgeId": "L2-C2",
            "name": "C2 靈性發展",
            "en": "C2 Spiritual Development",
            "detail": "分享在日常生活中運用童軍誓詞、規律及銘言的例子；參與一次默禱儀式。",
            "detailEn": "Spiritual development: reflect on beliefs and values and share with others.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          }
        ]
      },
      {
        "code": "L2-D",
        "name": "D 服務與環境",
        "en": "D Service and Environment",
        "items": [
          {
            "id": "L2-D1",
            "badgeId": "L2-D1",
            "name": "D1 服務他人",
            "en": "D1 Service to Others",
            "detail": "示範處理流鼻血、燒傷、燙傷、抽筋、扭傷、割傷及刺傷等意外事件（指出成因及處理先後次序）；完成不少於四小時由總會、地域、童軍區或旅團認許之服務，並簡單記錄服務內容。",
            "detailEn": "Service to others: planned community service with target-group analysis and reflection.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-D2",
            "badgeId": "L2-D2",
            "name": "D2 社區認識（選修）",
            "en": "D2 Community Awareness (elective)",
            "detail": "向小隊隊員介紹居所或旅部附近的社區設施，例如警署、醫院、消防局、民政事務處及公共交通工具等。（D2／D3／D4 三選一）",
            "detailEn": "One elective community-awareness option (citizenship, community involvement, multiculturalism or emergency preparedness).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-D3",
            "badgeId": "L2-D3",
            "name": "D3 生態環境（選修）",
            "en": "D3 Ecology and Environment (elective)",
            "detail": "與小隊隊員參觀一個以自然生境或生態為主題的展覽或地方，例如米埔、海下灣海岸公園、濕地公園、有機農場或自然教育徑。（D2／D3／D4 三選一）",
            "detailEn": "One elective ecology/environment project (environmental study, green camp or nature conservation).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          },
          {
            "id": "L2-D4",
            "badgeId": "L2-D4",
            "name": "D4 氣象（選修）",
            "en": "D4 Weather (elective)",
            "detail": "認識天氣與氣候之別及香港的氣候，並列舉天氣及氣候對戶外活動的影響（如氣溫、氣壓、風速風向、濕度及降水）。（D2／D3／D4 三選一）",
            "detailEn": "One elective weather study (records, forecasting or climate-change knowledge).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutPathfinderAward.pdf"
          }
        ]
      }
    ]
  },
  {
    "id": "L3",
    "badgeKey": "L3",
    "icon": "🏅",
    "name": "童軍標準獎章",
    "en": "Scout Standard Award",
    "color": "#1565C0",
    "purpose": "知識認知，建立成功感；建議約六個月完成",
    "purposeEn": "Knowledge and confidence; about six months",
    "description": "適合已完成童軍探索獎章，或年滿十三歲而考獲會員章並完成探索獎章「戶外挑戰」項目之童軍成員。可對照香港青年獎勵計劃銅章級（年滿十三歲及完成探索獎章後開展）。",
    "descriptionEn": "For Scouts who completed the Pathfinder Award, or aged 13+ holding the Membership Badge with the Pathfinder \"Outdoor Challenge\" section completed. Comparable to the HKAYP Bronze.",
    "itemLabel": "進度項目",
    "itemLabelEn": "Progress Items",
    "segments": [
      {
        "code": "L3-A",
        "name": "A 戶外挑戰",
        "en": "A Outdoor Challenge",
        "items": [
          {
            "id": "L3-A1",
            "badgeId": "L3-A1",
            "name": "A1 營藝",
            "en": "A1 Camping",
            "detail": "協助、參與及記錄一次至少兩日一夜露營並擔當一個小隊崗位；準備個人及小隊物資清單並收拾露營背囊；示範架搭、收拾及存放營幕；合作完成不少於四項營地建設；以天然物品生火並將水煮沸；按食物營養概念設計食譜、單獨烹調一款菜式並處理膳後工作。",
            "detailEn": "Camping skills: campsite choice, hygiene, constructions, equipment and cooking; plan and run a camp.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-A2",
            "badgeId": "L3-A2",
            "name": "A2 歷險",
            "en": "A2 Adventure",
            "detail": "指出兩種地圖比例並換算實際與地圖距離；示範正置地圖；以指南針及地圖定位（圖北、磁北、正北、四位及六位方格座標）；明瞭遠足安全守則及求救方法；與小隊完成一日或不少於十公里徒步，或不少於十五公里單車／獨木舟／風帆／船艇之郊野旅程並記錄。",
            "detailEn": "Adventure journey: plan and complete a hike/journey with route, safety and emergency planning.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-A3",
            "badgeId": "L3-A3",
            "name": "A3 先鋒工程",
            "en": "A3 Pioneering",
            "detail": "示範四方編結、十字編結、八字編結、圓周編結及展立編結之結法及用途；指出及遵守先鋒工程安全守則；運用結、索及編結完成一項先鋒工程活動（如羅馬炮彈架、童軍棍發彈器等）。",
            "detailEn": "Pioneering: ropes and lashings; build a pioneering project with the patrol.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-A4",
            "badgeId": "L3-A4",
            "name": "A4 戶外活動（選修）",
            "en": "A4 Outdoor Activities (elective)",
            "detail": "完成探索獎章戶外活動部分；考獲一個從未在過往獎章獲得的戶外相關專科徽章；完成城市追蹤活動，或密碼、旗號等通訊活動其中一項。（三選一，各獎章選項須相同）",
            "detailEn": "One elective outdoor option (hiking, cycling, riding or traditional games): train, take part, keep a record; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-A5",
            "badgeId": "L3-A5",
            "name": "A5 海上活動（選修）",
            "en": "A5 Sea Activities (elective)",
            "detail": "完成探索獎章海上活動部分；考獲艇工章；於本會海上活動中心參與一次童軍標準艇以外之海上活動。（海童軍必選此項）",
            "detailEn": "One elective sea option (canoeing, rowing, sailing, windsurfing): train and take part; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-A6",
            "badgeId": "L3-A6",
            "name": "A6 航空活動（選修）",
            "en": "A6 Air Activities (elective)",
            "detail": "完成探索獎章航空活動部分；考獲初級航空活動章；明瞭風如何影響飛行活動，或認識與飛行安全相關的航空法例。（空童軍必選此項）",
            "detailEn": "One elective air option (model flight or air visit) or hold the relevant air badge; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          }
        ]
      },
      {
        "code": "L3-B",
        "name": "B 個人發展",
        "en": "B Personal Development",
        "items": [
          {
            "id": "L3-B1",
            "badgeId": "L3-B1",
            "name": "B1 身心健康",
            "en": "B1 Physical and Mental Well-being",
            "detail": "考獲一個從未在過往獎章獲得、與體適能有關之專科徽章，例如運動、單車、射箭、游泳或獨木舟等。",
            "detailEn": "Physical and mental well-being: first aid, fitness training, mental-health knowledge and activities.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-B2",
            "badgeId": "L3-B2",
            "name": "B2 科學、科技、工程、藝術、數學及創意",
            "en": "B2 STEAM and Creativity",
            "detail": "參與一次營火會或營燈會活動；考獲一個STEAM相關專科徽章，或欣賞藝術表演、參觀藝術品展覽、表演小隊歌、參觀科技展覽、製作電池驅動電子小工具其中一項。",
            "detailEn": "STEAM and creativity: complete a project combining these fields with creativity.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          }
        ]
      },
      {
        "code": "L3-C",
        "name": "C 領導才與靈性發展",
        "en": "C Leadership and Spiritual Development",
        "items": [
          {
            "id": "L3-C1",
            "badgeId": "L3-C1",
            "name": "C1 領導才",
            "en": "C1 Leadership",
            "detail": "參與一次小隊戶內或戶外活動。",
            "detailEn": "Leadership: patrol leadership roles, meeting skills and a leadership project.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-C2",
            "badgeId": "L3-C2",
            "name": "C2 靈性發展",
            "en": "C2 Spiritual Development",
            "detail": "參與一次童軍崇拜會；向小隊介紹一個宗教（包括歷史背景及習慣），或分享一個信念。",
            "detailEn": "Spiritual development: reflect on beliefs and values and share with others.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          }
        ]
      },
      {
        "code": "L3-D",
        "name": "D 服務與環境",
        "en": "D Service and Environment",
        "items": [
          {
            "id": "L3-D1",
            "badgeId": "L3-D1",
            "name": "D1 服務他人",
            "en": "D1 Service to Others",
            "detail": "示範意外發生時迅速進行基本檢查及召喚緊急服務，認識急救原則；收拾一個兩日一夜露營用個人急救藥囊並認識用品用途；參與共不少於十小時服務（為期不少於十個星期）並簡單記錄；擔任一次與中式隊列或升國旗儀式相關之崗位。",
            "detailEn": "Service to others: planned community service with target-group analysis and reflection.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-D2",
            "badgeId": "L3-D2",
            "name": "D2 社區認識（選修）",
            "en": "D2 Community Awareness (elective)",
            "detail": "參與或觀賞一個本地文化習俗或傳統節慶活動，或以任何形式向小隊分享一個近期本地時事議題。（D2／D3／D4 三選一）",
            "detailEn": "One elective community-awareness option (citizenship, community involvement, multiculturalism or emergency preparedness).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-D3",
            "badgeId": "L3-D3",
            "name": "D3 生態環境（選修）",
            "en": "D3 Ecology and Environment (elective)",
            "detail": "向小隊介紹生物鏈、生物網及物種生態循環，或與小隊參觀體現上述內容的生態環境。（D2／D3／D4 三選一）",
            "detailEn": "One elective ecology/environment project (environmental study, green camp or nature conservation).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          },
          {
            "id": "L3-D4",
            "badgeId": "L3-D4",
            "name": "D4 氣象（選修）",
            "en": "D4 Weather (elective)",
            "detail": "介紹風速及風向的量度方法及基本原理，或介紹雲的形成過程及十種基本雲層的種類及特徵。（D2／D3／D4 三選一）",
            "detailEn": "One elective weather study (records, forecasting or climate-change knowledge).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          }
        ]
      },
      {
        "code": "L3-E",
        "name": "E 國際視野",
        "en": "E International Outlook",
        "items": [
          {
            "id": "L3-E1",
            "badgeId": "L3-E1",
            "name": "E1 國際視野",
            "en": "E1 International Outlook",
            "detail": "以任何形式向小隊隊員介紹一種外地的活動或文化，例如歌曲、遊戲、活動或語言等。",
            "detailEn": "International outlook: international Scouting or cultures knowledge plus an exchange activity.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          }
        ]
      },
      {
        "code": "L3-F",
        "name": "F 探索新知",
        "en": "F Exploring New Knowledge",
        "items": [
          {
            "id": "L3-F1",
            "badgeId": "L3-F1",
            "name": "F1 探索新知",
            "en": "F1 Discovery",
            "detail": "以童軍身份參與一次與其他旅團或團體的交流活動。",
            "detailEn": "Discovery: study/discovery project plus a six-month interest badge (two at L5); no repeated electives.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutStandardAward.pdf"
          }
        ]
      }
    ]
  },
  {
    "id": "L4",
    "badgeKey": "L4",
    "icon": "🌟",
    "name": "童軍高級獎章",
    "en": "Scout Advanced Award",
    "color": "#6A1B9A",
    "purpose": "知識深化，培養責任感；建議約十二個月完成",
    "purposeEn": "Deeper knowledge and responsibility; about twelve months",
    "description": "適合已完成童軍標準獎章，或年滿十四歲而考獲會員章並完成探索及標準獎章「戶外挑戰」項目之童軍成員。可對照香港青年獎勵計劃銅章級。D2-D5 選修四選二，且須與總領袖獎章的選項不同。",
    "descriptionEn": "For Scouts who completed the Standard Award, or aged 14+ holding the Membership Badge with the Pathfinder and Standard \"Outdoor Challenge\" sections completed. Comparable to HKAYP Bronze. Choose TWO of D2-D5, different from the Chief Scout's Award choices.",
    "itemLabel": "進度項目",
    "itemLabelEn": "Progress Items",
    "segments": [
      {
        "code": "L4-A",
        "name": "A 戶外挑戰",
        "en": "A Outdoor Challenge",
        "items": [
          {
            "id": "L4-A1",
            "badgeId": "L4-A1",
            "name": "A1 營藝",
            "en": "A1 Camping",
            "detail": "協助策劃及參與一次至少兩日一夜的露營並負責一個範疇（膳食安排、營地衛生或物資管理）；合作完成不少於六項營地建設；進行一次原野烹飪；明瞭保護及清理營地的要求。",
            "detailEn": "Camping skills: campsite choice, hygiene, constructions, equipment and cooking; plan and run a camp.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-A2",
            "badgeId": "L4-A2",
            "name": "A2 歷險",
            "en": "A2 Adventure",
            "detail": "完成標準獎章歷險部分；認識等高線與地形關係；示範野外迷失時無指南針辨向技巧；明瞭山野危機成因及緊急處理；明瞭「不留痕」；完成以下一項旅程並交計劃書及記錄：兩日一夜不少於十五公里遠足或二十公里單車／獨木舟／風帆／船艇（須先完成一日野外訓練及一日實習旅程）、一日訓練旅程加兩日一夜不少於十二小時旅程，或黃昏至黎明遠足旅程。",
            "detailEn": "Adventure journey: plan and complete a hike/journey with route, safety and emergency planning.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-A3",
            "badgeId": "L4-A3",
            "name": "A3 先鋒工程",
            "en": "A3 Pioneering",
            "detail": "示範雙接繩結、漁翁結、三套結、勾口結、吊板結及普通繩端結之結法及用途；選擇、使用及保養先鋒工程工具；運用不少於兩種編結製作兩項簡單先鋒工程。",
            "detailEn": "Pioneering: ropes and lashings; build a pioneering project with the patrol.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-A4",
            "badgeId": "L4-A4",
            "name": "A4 戶外活動（選修）",
            "en": "A4 Outdoor Activities (elective)",
            "detail": "完成標準獎章戶外活動部分；考獲露營、探險、先鋒工程或原野烹飪技能組專科徽章其中之一。（三選一，各獎章選項須相同）",
            "detailEn": "One elective outdoor option (hiking, cycling, riding or traditional games): train, take part, keep a record; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-A5",
            "badgeId": "L4-A5",
            "name": "A5 海上活動（選修）",
            "en": "A5 Sea Activities (elective)",
            "detail": "完成標準獎章海上活動部分；考獲水手章；考獲一個與海上活動有關之專科徽章。（海童軍必選此項）",
            "detailEn": "One elective sea option (canoeing, rowing, sailing, windsurfing): train and take part; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-A6",
            "badgeId": "L4-A6",
            "name": "A6 航空活動（選修）",
            "en": "A6 Air Activities (elective)",
            "detail": "完成標準獎章航空活動部分；考獲中級航空活動章；認識簡單的航空氣象（雷暴、積水及濃霧等對飛機的危險）。（空童軍必選此項）",
            "detailEn": "One elective air option (model flight or air visit) or hold the relevant air badge; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          }
        ]
      },
      {
        "code": "L4-B",
        "name": "B 個人發展",
        "en": "B Personal Development",
        "items": [
          {
            "id": "L4-B1",
            "badgeId": "L4-B1",
            "name": "B1 身心健康",
            "en": "B1 Physical and Mental Well-being",
            "detail": "完成以下一項：考獲體適能相關專科徽章（學習或練習最少十三小時、持續不少於三個月）；訂立、執行及記錄為期最少十三小時、持續不少於三個月的體能訓練；介紹人體生長發育及不良嗜好對健康的影響；宣傳一個健康生活主題；或考獲「積極公民」獎章系列禁毒章。",
            "detailEn": "Physical and mental well-being: first aid, fitness training, mental-health knowledge and activities.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-B2",
            "badgeId": "L4-B2",
            "name": "B2 科學、科技、工程、藝術、數學及創意",
            "en": "B2 STEAM and Creativity",
            "detail": "考獲一個從未在過往獎章獲得的STEAM相關專科徽章；並完成以下一項：表演一個節目、製作一件藝術品、創作及表演小隊歌、製作一個符合比例的模型、以資訊科技製作宣傳品，或製作電動機械模型。",
            "detailEn": "STEAM and creativity: complete a project combining these fields with creativity.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          }
        ]
      },
      {
        "code": "L4-C",
        "name": "C 領導才與靈性發展",
        "en": "C Leadership and Spiritual Development",
        "items": [
          {
            "id": "L4-C1",
            "badgeId": "L4-C1",
            "name": "C1 領導才",
            "en": "C1 Leadership",
            "detail": "出席或列席最少一次小隊長會議並負責執行其中一項議決案；計劃及執行一次戶內或戶外小隊活動。",
            "detailEn": "Leadership: patrol leadership roles, meeting skills and a leadership project.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-C2",
            "badgeId": "L4-C2",
            "name": "C2 靈性發展",
            "en": "C2 Spiritual Development",
            "detail": "擔任及履行一小隊或旅團職務不少於六個月；參與一個宗教／靈性發展活動，或向小隊分享個人宗教信仰。",
            "detailEn": "Spiritual development: reflect on beliefs and values and share with others.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          }
        ]
      },
      {
        "code": "L4-D",
        "name": "D 服務與環境",
        "en": "D Service and Environment",
        "items": [
          {
            "id": "L4-D1",
            "badgeId": "L4-D1",
            "name": "D1 服務他人",
            "en": "D1 Service to Others",
            "detail": "收拾一個兩日一夜露營用小隊急救藥囊並指出用品用途；示範處理創傷、出血、中暑、熱衰竭、體溫過低、異物入眼耳鼻及昆蟲動物咬傷；協助策劃及持續參與共不少於十六小時服務（為期不少於十六個星期，其中不少於四小時以童軍身份）並記錄。",
            "detailEn": "Service to others: planned community service with target-group analysis and reflection.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-D2",
            "badgeId": "L4-D2",
            "name": "D2 社區認識（選修）",
            "en": "D2 Community Awareness (elective)",
            "detail": "完成以下一項：考獲公民、多元共融、公共衞生、社區參與章或社區應急先鋒章等；認識區議會及立法會功能並向小隊解釋投票重要性；參與一次共融活動；或認識香港非物質文化遺產／參觀法定古蹟。（D2-D5 四選二，須與總領袖獎章選項不同）",
            "detailEn": "One elective community-awareness option (citizenship, community involvement, multiculturalism or emergency preparedness).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-D3",
            "badgeId": "L4-D3",
            "name": "D3 生態環境（選修）",
            "en": "D3 Ecology and Environment (elective)",
            "detail": "介紹香港生境、物種分類、多樣性及分佈並舉出瀕危物種及其威脅；或參與一次與生物多樣性或瀕危物種相關的活動。（D2-D5 四選二）",
            "detailEn": "One elective ecology/environment project (environmental study, green camp or nature conservation).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-D4",
            "badgeId": "L4-D4",
            "name": "D4 氣象（選修）",
            "en": "D4 Weather (elective)",
            "detail": "介紹四季成因及廿四節氣與風土習俗；並介紹本港氣候及適合的小隊活動，或本港天氣術語、警告定義及惡劣天氣應變措施。（D2-D5 四選二）",
            "detailEn": "One elective weather study (records, forecasting or climate-change knowledge).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          },
          {
            "id": "L4-D5",
            "badgeId": "L4-D5",
            "name": "D5 危機及保護（選修）",
            "en": "D5 Risks and Protection (elective)",
            "detail": "參與一次與聯合國可持續發展目標或「可持續發展」相關的活動；或參與一次環境保育活動（實踐、推廣或教育）。（D2-D5 四選二）",
            "detailEn": "One elective risks/protection study (crime risks, health risks or disaster response).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          }
        ]
      },
      {
        "code": "L4-E",
        "name": "E 國際視野",
        "en": "E International Outlook",
        "items": [
          {
            "id": "L4-E1",
            "badgeId": "L4-E1",
            "name": "E1 國際視野",
            "en": "E1 International Outlook",
            "detail": "向小隊介紹一個國際組織及其宗旨、目的及工作；或介紹一個其他國家／地區的童軍組織及其支部架構及活動。",
            "detailEn": "International outlook: international Scouting or cultures knowledge plus an exchange activity.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          }
        ]
      },
      {
        "code": "L4-F",
        "name": "F 探索新知",
        "en": "F Exploring New Knowledge",
        "items": [
          {
            "id": "L4-F1",
            "badgeId": "L4-F1",
            "name": "F1 探索新知",
            "en": "F1 Discovery",
            "detail": "參與一項從未嘗試、具自我挑戰及自我成長元素的活動（如攀石或歷奇活動），並向團內其他成員介紹及分享經歷。",
            "detailEn": "Discovery: study/discovery project plus a six-month interest badge (two at L5); no repeated electives.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ScoutAdvancedAward.pdf"
          }
        ]
      }
    ]
  },
  {
    "id": "L5",
    "badgeKey": "L5",
    "icon": "👑",
    "name": "總領袖獎章",
    "en": "Chief Scout's Award",
    "color": "#B71C1C",
    "purpose": "童軍支部最高獎章，培訓策劃及領導才能；建議約十二個月",
    "purposeEn": "Highest award of the Scout Section; planning and leadership; about twelve months",
    "description": "適合已完成童軍高級獎章，或年滿十四歲而考獲會員章並完成探索、標準及高級獎章「戶外挑戰」項目及童軍高級獎章之童軍成員。可對照香港青年獎勵計劃銀章級。D2-D5 選修四選二，且須與高級獎章的選項不同。",
    "descriptionEn": "For Scouts who completed the Advanced Award, or aged 14+ with the required Outdoor Challenge sections and the Advanced Award completed. Comparable to HKAYP Silver. Choose TWO of D2-D5, different from the Advanced Award choices.",
    "itemLabel": "進度項目",
    "itemLabelEn": "Progress Items",
    "segments": [
      {
        "code": "L5-A",
        "name": "A 戶外挑戰",
        "en": "A Outdoor Challenge",
        "items": [
          {
            "id": "L5-A1",
            "badgeId": "L5-A1",
            "name": "A1 營藝",
            "en": "A1 Camping",
            "detail": "策劃及實行一次至少兩日一夜的露營（計劃須包括物資、營地資料、營區分佈及紮作圖、膳食、活動、財政、交通及工作分配）；教授小隊隊員基本露營技巧（收拾背囊、架搭營幕、戶外烹調、營地紮作）；製作一個露營報告（包括日誌、財政報告及檢討）。",
            "detailEn": "Camping skills: campsite choice, hygiene, constructions, equipment and cooking; plan and run a camp.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-A2",
            "badgeId": "L5-A2",
            "name": "A2 歷險",
            "en": "A2 Adventure",
            "detail": "教授小隊隊員基本郊野旅程技巧（地圖、圖例、比例、方格座標、正置地圖、收拾背囊）；示範野外基本求生技能（淨化食水、殘存盒、求生訊號）；完成以下一項旅程並交計劃書及記錄：兩日一夜不少於二十公里遠足或二十五公里單車／獨木舟／風帆／船艇，或不少於三日兩夜（最少共二十一小時）之郊野旅程（須先完成一日及兩日一夜訓練旅程）。",
            "detailEn": "Adventure journey: plan and complete a hike/journey with route, safety and emergency planning.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-A3",
            "badgeId": "L5-A3",
            "name": "A3 先鋒工程",
            "en": "A3 Pioneering",
            "detail": "計劃及帶領小隊或團完成一個應用不少於三種編結之先鋒工程（包括事前準備、事後收拾及計劃書）；教授小隊隊員或團員基本先鋒工程技巧（繩結結法用途及收繩）。",
            "detailEn": "Pioneering: ropes and lashings; build a pioneering project with the patrol.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-A4",
            "badgeId": "L5-A4",
            "name": "A4 戶外活動（選修）",
            "en": "A4 Outdoor Activities (elective)",
            "detail": "完成高級獎章戶外活動部分；策劃和參與一個全日小隊、團或旅戶外活動；考獲露營、探險、先鋒工程或原野烹飪技能組專科徽章其中之一（從未在過往獎章獲得）。（三選一，各獎章選項須相同）",
            "detailEn": "One elective outdoor option (hiking, cycling, riding or traditional games): train, take part, keep a record; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-A5",
            "badgeId": "L5-A5",
            "name": "A5 海上活動（選修）",
            "en": "A5 Sea Activities (elective)",
            "detail": "完成高級獎章海上活動部分；策劃及參與一個不少於六小時之海上旅程。（海童軍必選此項）",
            "detailEn": "One elective sea option (canoeing, rowing, sailing, windsurfing): train and take part; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-A6",
            "badgeId": "L5-A6",
            "name": "A6 航空活動（選修）",
            "en": "A6 Air Activities (elective)",
            "detail": "完成高級獎章航空活動部分；與團長商討後，於自選航空活動項目內選擇兩項從未進行過之項目。（空童軍必選此項）",
            "detailEn": "One elective air option (model flight or air visit) or hold the relevant air badge; use once.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          }
        ]
      },
      {
        "code": "L5-B",
        "name": "B 個人發展",
        "en": "B Personal Development",
        "items": [
          {
            "id": "L5-B1",
            "badgeId": "L5-B1",
            "name": "B1 身心健康",
            "en": "B1 Physical and Mental Well-being",
            "detail": "考獲一個從未在過往獎章獲得的體適能相關專科徽章（學習或練習最少二十六小時、持續不少於六個月）；並完成以下一項：考獲身心健康相關專科徽章或獎章（如精神健康、食物營養、公共衞生、「積極公民」獎章系列保護兒童章，或完成 SOUL Keeper 精神健康守護者課程 Level 1），或與隊員認識香港精神健康支援／參觀精神健康機構。",
            "detailEn": "Physical and mental well-being: first aid, fitness training, mental-health knowledge and activities.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-B2",
            "badgeId": "L5-B2",
            "name": "B2 科學、科技、工程、藝術、數學及創意",
            "en": "B2 STEAM and Creativity",
            "detail": "創作及帶領一個營火會或營燈會的歡呼、表演節目或遊戲；並完成以下一項：分享藝術品創作過程、教授製作模型、教授以資訊科技製作宣傳品、教授製作電池驅動機械、建立電子地圖，或製作一個可操控之機械模型。",
            "detailEn": "STEAM and creativity: complete a project combining these fields with creativity.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          }
        ]
      },
      {
        "code": "L5-C",
        "name": "C 領導才與靈性發展",
        "en": "C Leadership and Spiritual Development",
        "items": [
          {
            "id": "L5-C1",
            "badgeId": "L5-C1",
            "name": "C1 領導才",
            "en": "C1 Leadership",
            "detail": "考獲領導才獎章。",
            "detailEn": "Leadership: patrol leadership roles, meeting skills and a leadership project.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-C2",
            "badgeId": "L5-C2",
            "name": "C2 靈性發展",
            "en": "C2 Spiritual Development",
            "detail": "向新加入的成員介紹童軍誓詞、規律及銘言的內容和意義；帶領一次默禱儀式、協助一次童軍崇拜會，或考獲宗教章。",
            "detailEn": "Spiritual development: reflect on beliefs and values and share with others.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          }
        ]
      },
      {
        "code": "L5-D",
        "name": "D 服務與環境",
        "en": "D Service and Environment",
        "items": [
          {
            "id": "L5-D1",
            "badgeId": "L5-D1",
            "name": "D1 服務他人",
            "en": "D1 Service to Others",
            "detail": "考獲急救、消防或拯溺服務組專科徽章其中之一；考獲服務獎章；協助策劃及持續參與共不少於二十六小時服務（為期不少於二十六個星期，其中至少兩小時以童軍身份）並記錄。",
            "detailEn": "Service to others: planned community service with target-group analysis and reflection.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-D2",
            "badgeId": "L5-D2",
            "name": "D2 社區認識（選修）",
            "en": "D2 Community Awareness (elective)",
            "detail": "完成以下一項：考獲旅遊興趣組專科徽章；學習與有特殊需要人士的溝通方法（如手語或凸字）；或調查社區設施及服務並發佈結果及建議。（D2-D5 四選二，須與高級獎章選項不同）",
            "detailEn": "One elective community-awareness option (citizenship, community involvement, multiculturalism or emergency preparedness).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-D3",
            "badgeId": "L5-D3",
            "name": "D3 生態環境（選修）",
            "en": "D3 Ecology and Environment (elective)",
            "detail": "考獲一個從未在過往獎章獲得、與生態環境有關之專科徽章或獎章，例如地質、自然、農務、樹木護理或「地球部落」系列徽章等。（D2-D5 四選二）",
            "detailEn": "One elective ecology/environment project (environmental study, green camp or nature conservation).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-D4",
            "badgeId": "L5-D4",
            "name": "D4 氣象（選修）",
            "en": "D4 Weather (elective)",
            "detail": "完成以下一項：考獲氣象興趣組專科徽章；教授一項氣象知識；或介紹天氣圖並記錄童軍營地自動氣象站一週天氣。（D2-D5 四選二）",
            "detailEn": "One elective weather study (records, forecasting or climate-change knowledge).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          },
          {
            "id": "L5-D5",
            "badgeId": "L5-D5",
            "name": "D5 危機及保護（選修）",
            "en": "D5 Risks and Protection (elective)",
            "detail": "介紹人類活動對環境的影響（如酸雨、溫室效應、污染等）；或計劃及帶領參與不少於一天或兩次環境保育活動。（D2-D5 四選二）",
            "detailEn": "One elective risks/protection study (crime risks, health risks or disaster response).",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          }
        ]
      },
      {
        "code": "L5-E",
        "name": "E 國際視野",
        "en": "E International Outlook",
        "items": [
          {
            "id": "L5-E1",
            "badgeId": "L5-E1",
            "name": "E1 國際視野",
            "en": "E1 International Outlook",
            "detail": "完成以下一項：參加國際電訊日與外地童軍聯絡；介紹一位外地童軍朋友（持續聯繫不少於三個月並分享）；或參加一個與外地童軍交流的活動。",
            "detailEn": "International outlook: international Scouting or cultures knowledge plus an exchange activity.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          }
        ]
      },
      {
        "code": "L5-F",
        "name": "F 探索新知",
        "en": "F Exploring New Knowledge",
        "items": [
          {
            "id": "L5-F1",
            "badgeId": "L5-F1",
            "name": "F1 探索新知",
            "en": "F1 Discovery",
            "detail": "完成以下各項：參與一項從未嘗試、具自我挑戰及成長元素的活動並向團內成員介紹；考獲一個教導組專科徽章；考獲深資童軍先修章。",
            "detailEn": "Discovery: study/discovery project plus a six-month interest badge (two at L5); no repeated electives.",
            "assessedBy": "member",
            "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Progressive/ChiefScoutsAward.pdf"
          }
        ]
      }
    ]
  }
];

/** 專科徽章：SC-INT/PUR/SER/INS/SEA/AIR/OTH-*（單一完成紀錄：日期＋證書編號） */
export const OTHER_BADGES = [
  {
    "id": "SC-INT-001",
    "badgeId": "SC-INT-001",
    "name": "釣魚",
    "en": "Angler",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "正確使用釣魚用具；認識安全守則；認識不同釣魚方式、釣具、魚餌、釣點及釣法；認識香港常見魚類、相關法例及釣魚禮儀；示範釣魚技巧並處理釣獲。",
    "descEn": "Angler: correct tackle use, safety, fishing methods/baits/grounds, common Hong Kong fish and regulations, etiquette, demonstrated skills and handling of catches.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Angler.pdf"
  },
  {
    "id": "SC-INT-002",
    "badgeId": "SC-INT-002",
    "name": "愛護動物",
    "en": "Animal Welfare",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "(服務組) 完成下列其中一項：考獲動物飼養章（興趣組），或了解一隻寵物的基本資料及日常照顧需要並向主考報告；明瞭動物福利、保護動物法例、遺棄寵物原因、香港動物福利機構工作，參觀動物福利機構／診所，探討一則動物福利時事並提出改善方法，認識尊重野生動物及自我保護；參與至少一次愛護動物相關義工服務（總時數不少於六小時）。",
    "descEn": "(Service) Animal Carer: pet-keeping knowledge or the Petkeeper badge; animal welfare, laws, abandonment, HK welfare organisations, a clinic visit, a current-issue discussion, wildlife respect; at least six hours of related volunteer service.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/AnimalCarer.pdf"
  },
  {
    "id": "SC-INT-003",
    "badgeId": "SC-INT-003",
    "name": "射箭",
    "en": "Archery",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "說明弓及箭各部分名稱；認識裝拆及保養弓、箭、弦；認識安全守則；正確示範基本姿勢（企立、推弓、拉弦、瞄準、放箭、完成）；認識熱身及緩和運動；認識比賽規則；認識計分及升級制度；連續參與三個月練習。",
    "descEn": "Archery: bow/arrow parts, care, safety, basic stance and release, warm-up, competition rules, scoring/grading, three months of practice.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Archery.pdf"
  },
  {
    "id": "SC-INT-004",
    "badgeId": "SC-INT-004",
    "name": "藝術",
    "en": "Artist",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "對其中一項藝術活動有基本認識（繪畫、陶瓷、雕塑、書法、戲劇、舞蹈或相若活動）；持續參與不少於三個月；示範或展示個人作品；認識該活動中喜愛或有成就的人物或團體並介紹其獨特之處。",
    "descEn": "Artist: basics of one art form (painting, ceramics, sculpture, calligraphy, drama, dance or similar); three months of participation; show personal work; introduce an admired artist/group.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Artist.pdf"
  },
  {
    "id": "SC-INT-005",
    "badgeId": "SC-INT-005",
    "name": "運動",
    "en": "Athlete",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "對其中一項運動有基本認識（田徑、球類、溜冰、跳繩、體操或相若運動）；持續參與不少於三個月；示範該項運動各種基本技巧；認識喜愛或有成就的人物或團體並介紹其獨特之處。",
    "descEn": "Athlete: basics of one sport (athletics, ball games, skating, rope skipping, gymnastics or similar); three months; demonstrate basic skills; introduce an admired athlete/team.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Athlete.pdf"
  },
  {
    "id": "SC-INT-006",
    "badgeId": "SC-INT-006",
    "name": "觀鳥",
    "en": "Birdwatcher",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "認識觀鳥的來源歷史、鳥類身體結構與特徵、留鳥候鳥及遷徙路線、鳥類與自然生境關係、本地觀鳥組織及熱門地點、本地十二種常見鳥種、觀鳥注意事項及禮儀、技巧及器材；參加一次觀鳥活動並作出紀錄。",
    "descEn": "Birdwatcher: history, bird anatomy and migration, habitats, local organisations and sites, twelve common species, etiquette, techniques and equipment; join one birdwatching trip and record it.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Birdwatcher.pdf"
  },
  {
    "id": "SC-INT-007",
    "badgeId": "SC-INT-007",
    "name": "抱石",
    "en": "Boulderer",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "懂得安全進行抱石（場地及環境安全、正確下降及落地姿勢、適當裝備如攀石鞋及粉袋）；示範各種基本技巧（如三點支撐法、不同手部抓握方式）；持續參與不少於一個月。",
    "descEn": "Boulderer: safe practice (venue, landing, equipment), basic techniques (three-point support, grip types), at least one month of participation.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Boulderer.pdf"
  },
  {
    "id": "SC-INT-008",
    "badgeId": "SC-INT-008",
    "name": "營地烹飪",
    "en": "Camp Cook",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "設計一小隊週末露營（早、午、晚三餐菜單，含材料及份量、價格、烹調方法；早餐最少一熱食，午、晚餐三餸一湯以新鮮食物為主）；並由一助手協助在露營期間烹調所設計之晚餐。宜在小隊或團露營時考驗。",
    "descEn": "Design a patrol weekend camp menu (three meals with ingredients, prices and methods; breakfast with one hot dish; lunch/dinner three dishes and a soup from fresh food) and cook the designed dinner at camp with one assistant.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/CampCook.pdf"
  },
  {
    "id": "SC-INT-009",
    "badgeId": "SC-INT-009",
    "name": "營火",
    "en": "Campfire Host",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "明白營火會的意義和類別；簡述營火會儀式；製作及擁有一件營火袍並縫上至少兩個布章；認識至少十首營火歌曲（其中一首必須為「Campfire's Burning 熊熊烈火」）；參與一次營火會；創作及帶領一個營火會歡呼、表演節目或遊戲。",
    "descEn": "Know the meaning and types of campfires, the ceremony; make and own a campfire blanket with at least two badges; know at least ten campfire songs including 'Campfire's Burning'; join a campfire; create and lead a cheer, item or game.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/CampfireHost.pdf"
  },
  {
    "id": "SC-INT-010",
    "badgeId": "SC-INT-010",
    "name": "獨木舟",
    "en": "Canoeist",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "（興趣組獨木舟章）持有本會有效游泳測試證明書；考獲中國香港獨木舟總會獨木舟二星章／少年獨木舟海獅章或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "(Interest Canoeist) Valid SAHK swimming test certificate and the HK Canoe Union 2-star canoe / junior Sea Lion certificate (or equivalent).",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Canoeist.pdf"
  },
  {
    "id": "SC-INT-011",
    "badgeId": "SC-INT-011",
    "name": "搜集",
    "en": "Collector",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "以最少六個月時間搜集一種物件（如郵票、火柴盒、錢幣、貝殼等）並有系統地整理，數量足夠、知其本質特性，注重質素；與主考討論選擇理由，顯示真正興趣及認識。",
    "descEn": "Collect and catalogue one type of object (stamps, matchboxes, coins, shells etc.) over at least six months in sufficient quantity and quality; discuss the choice with the examiner and show real interest and knowledge.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Collector.pdf"
  },
  {
    "id": "SC-INT-012",
    "badgeId": "SC-INT-012",
    "name": "電腦",
    "en": "Computer",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "認識軟件和硬件的分別、基本硬件（CPU、GPU 等）、電腦演變史；認識有損和無損檔案格式；闡述聲音、圖像、視像如何數碼化；認識惡意軟件、保護資訊及安全通訊；認識互聯網基本概念及路由器組成；使用試算表／文字處理器／簡報／繪圖軟件完成一項小隊事工。",
    "descEn": "Computer: hardware vs software, components, history, lossy/lossless formats, digitising media, malware and safe communication, internet basics, and a patrol project using office software.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Computer.pdf"
  },
  {
    "id": "SC-INT-013",
    "badgeId": "SC-INT-013",
    "name": "單車",
    "en": "Cyclist",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "擁有或曾滿意地使用一輛裝備及功能良好的單車六個月以上；能作簡單單車修理（更換內外呔、補呔、換車掣、調整座位及車高位置等）；對交通安全規則、交通標誌、燈號、道路符號、本地道路編排和方向有認識並能閱讀街道圖；參加一項包括使用單車的童軍活動。",
    "descEn": "Cyclist: own/use a roadworthy bicycle six+ months, simple repairs, traffic rules and signs, read a street map; join one cycling Scout activity.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Cyclist.pdf"
  },
  {
    "id": "SC-INT-014",
    "badgeId": "SC-INT-014",
    "name": "龍舟",
    "en": "Dragon Boatman",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "持有本會有效游泳測試證明書；完成由本會舉辦（一天不少於六小時）之龍舟訓練班或認許之龍舟槳手訓練班：理論——龍舟運動歷史發展、熱身重要性、裝備及各部分名稱、類別及製造材料、水上安全知識、一般賽事賽制；實習——握槳方法、坐姿、每一槳四個步驟（準備、入水、划水、起水）、前槳後槳橫槳急停技術、覆舟處理、對齊平衡技巧、準備收拾保養龍舟及槳、不少於兩小時訓練及一場250米練習賽。",
    "descEn": "Dragon Boatman: swimming certificate plus a one-day approved course — history, warm-up, equipment, boat types, water safety, race rules; paddling technique, capsize handling, care, 2h training and a 250 m practice race.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/DragonBoatman.pdf"
  },
  {
    "id": "SC-INT-015",
    "badgeId": "SC-INT-015",
    "name": "步操",
    "en": "Footdrill",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "（興趣組步操章）主考必須持有總會認可步操基本訓練班證書。明瞭步操的目的；明瞭及能正確做出立定步操（立正、稍息、休息、左右轉、後轉、斜轉、橫移、向前敬禮）、快步步操（快步開步、快步停步）及排列隊形（報數及排列、解散）。",
    "descEn": "(Interest Footdrill) Examiner holds an approved basic footdrill certificate; know the purpose of footdrill and correctly perform the halt movements, quick-time marching and formation drill.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Footdrill.pdf"
  },
  {
    "id": "SC-INT-016",
    "badgeId": "SC-INT-016",
    "name": "地質",
    "en": "Geologist",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "解釋岩石及礦物的定義、火成岩／沉積岩／變質岩的特徵和形成過程、岩石循環；略述香港主要岩石及礦物種類、例子及分佈；自製一本十五種以上岩石礦物觀察紀錄冊（照片、分類、來源、化學成份、物理性質）；參加一次戶外地質考察並在旅團集會匯報。",
    "descEn": "Explain rocks/minerals, the three rock types and the rock cycle; outline Hong Kong's main rocks and minerals; compile a 15-specimen observation logbook; join a field geology trip and report back.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Geologist.pdf"
  },
  {
    "id": "SC-INT-017",
    "badgeId": "SC-INT-017",
    "name": "騎術",
    "en": "Horseman",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "對馬匹烈性行為有基本認識；認識策騎和處理馬匹的保護衣物裝備；安全牽引馬匹、安全使用上馬台；調整腳鐙帶及檢查馬肚帶；示範慢步、快步、輕快步的騎術（起步、停止、左右轉）；認識常用馬具（馬鞍、馬肚帶、馬勒、嚼子、韁繩、腳鐙、腳鐙帶）；認識騎術學校「道路規則」；說出馬匹身體六個部分；用軟刷為馬匹刷身。",
    "descEn": "Horseman: horse behaviour, riding clothing and tack, safe leading and mounting, girth/straps, walk/trot/canter controls, tack names, riding-school rules, horse anatomy, grooming.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Horseman.pdf"
  },
  {
    "id": "SC-INT-018",
    "badgeId": "SC-INT-018",
    "name": "風箏",
    "en": "Kite Flyer",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "對風箏歷史有基本知識；製作一款風箏並簡介各部分名稱及製作方法；解釋風箏飛行原理；明瞭安全守則及飄放風箏的相關法例；成功將風箏升空並停留在天空中不少於十五分鐘。",
    "descEn": "Know kite history; build a kite and explain its parts and making; explain flight principles; know safety rules and relevant laws; keep a kite flying for at least fifteen minutes.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/KiteFlyer.pdf"
  },
  {
    "id": "SC-INT-019",
    "badgeId": "SC-INT-019",
    "name": "圖書管理",
    "en": "Librarian",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "向主考描述一本書的製造過程及保養方法；明瞭圖書的編目方法；知道怎樣利用圖書館的目錄索引；擔任學校或團體的圖書館服務員最少六個月並有良好服務紀錄（需出示書面證明）。",
    "descEn": "Librarian: book manufacture and care, cataloguing, library index use; six+ months as a library assistant with a good record and written proof.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Librarian.pdf"
  },
  {
    "id": "SC-INT-020",
    "badgeId": "SC-INT-020",
    "name": "氣象",
    "en": "Meteorologist",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "明瞭各種天氣要素、雲的形成及十種基本雲層；閱讀地面天氣圖及等壓線圖簡述天氣概況；明瞭四季成因、廿四節氣與中國習俗、天氣與氣候的分別；明瞭本港氣候、常用天氣術語及警告定義、獲取天氣資訊的方法；明瞭天氣對童軍活動的影響並與小隊討論應變；認識人類活動對氣候變化的影響並建議綠色童軍生活；利用童軍自動氣象站資料記錄一週天氣並解釋變化趨勢。",
    "descEn": "Weather elements, clouds and ten cloud types; read surface charts; seasons and solar terms; weather vs climate; Hong Kong climate, terms and warnings; weather sources; activity contingency discussion; climate change and green Scouting; record one week of weather-station data and explain trends.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Meteorologist.pdf"
  },
  {
    "id": "SC-INT-021",
    "badgeId": "SC-INT-021",
    "name": "模型製作",
    "en": "Model Maker",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "完成 (A) 至 (D) 其中一項：(A) 模型飛機（滑翔25秒／線拖45秒／橡筋30秒／機動45秒／控制線飛行）及飛行基本原理（三軸）；(B) 長度45公分電動或機動模型船直線航行23米及解釋亞基米得原理；(C) 電動軌跡跑車（不准用模型盒）不停行駛122米或兩種模型汽車走動18米，量度路軌輪距及解釋阿克曼駕駛原理；(D) 車廂在火車頭拖引下行走、按比例景物模型、認識指揮電動火車訊號。",
    "descEn": "Model Maker: one of model aircraft (flight times), model boat 45cm straight 23m with Archimedes' principle, model cars on track with Ackermann steering, or a railway carriage and proportional scenery with signals.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/ModelMaker.pdf"
  },
  {
    "id": "SC-INT-022",
    "badgeId": "SC-INT-022",
    "name": "音樂",
    "en": "Musician",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "完成 (A) 至 (E) 其中一項：(A) 聲樂——獨唱或合唱高低音部分及唱一首臨時指定歌；(B) 器樂——演奏自選樂曲或樂隊現役成員、臨時指定樂曲；(C) 民歌——無伴奏或自我伴奏或樂器演奏兩首民歌、基本樂理、討論喜愛民歌歌手；(D) 風笛——調校音調、2/4及6/8拍進行曲、慢進行曲、進行曲斯特拉斯貝舞曲蘇格蘭高地舞曲；(E) 樂隊——小鼓、高音鼓、低音鼓或號角的專長考核（保養、操行、敲擊拍子、旋轉敲擊或號音）。各項須了解基本樂理（三種譜號、三個大調或小調、奏鳴曲協奏曲聖樂分別）並與主考研究近期演奏會。",
    "descEn": "Musician: one of voice, instrumental, folk song, bagpipes or band percussion/bugle, with music theory (clefs, keys, forms) and a discussion of a recent concert.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Musician.pdf"
  },
  {
    "id": "SC-INT-023",
    "badgeId": "SC-INT-023",
    "name": "自然",
    "en": "Naturalist",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "認識昆蟲的種類及身體結構（鱗翅目、蜻蜓目、膜翅目、直翅目、半翅目、螳螂目、雙翅目、鞘翅目）；認識三種香港常見昆蟲的習性；認識植物種類（非維管與維管、無種子與有種子、無花與有花）；辨認十種香港常見植物；以照片記錄攀援植物、喬木和灌木各兩種，或三種昆蟲。",
    "descEn": "Naturalist: insect orders and anatomy, three local insects' habits, plant groups, identify ten common Hong Kong plants, photo records of climbers/trees/shrubs or three insects.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Naturalist.pdf"
  },
  {
    "id": "SC-INT-024",
    "badgeId": "SC-INT-024",
    "name": "公園定向",
    "en": "Park Orienteer",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "認識越野式及奪分式定向比賽類型、所需裝備；明瞭公園定向地圖的比例、等高線、顏色及圖例；懂得正置地圖；明瞭 3S 及拇指輔行法；明瞭比賽程序、安全措施及規則；描述地圖上不少於一百米路程的地理特徵；參與一次公園定向活動、比賽或短途定向賽事。",
    "descEn": "Park orienteering race types and equipment; map scale, contours, colours and legend; orienting the map; 3S and thumb compass methods; race procedure, safety and rules; describe features along a 100m route; take part in one park orienteering event.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/ParkOrienteer.pdf"
  },
  {
    "id": "SC-INT-025",
    "badgeId": "SC-INT-025",
    "name": "動物飼養",
    "en": "Petkeeper",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "辨別五大類脊椎動物（魚類、兩棲類、爬行類、鳥類及哺乳類）及無脊椎動物，認識生活習性、棲息地和生存基本需要；認識香港動物常見疾病；明瞭飼養動物的責任；擁有飼養任何動物至少一年的經驗並作簡單記錄（按哺乳類、兩棲類、爬行類、鳥類或魚類列出居住空間、飲食、清潔、訓練等注意事項）。",
    "descEn": "Petkeeper: vertebrate/invertebrate groups and habitats, common HK animal diseases, responsibilities of pet keeping; at least one year of documented animal-keeping experience with species-specific care notes.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Petkeeper.pdf"
  },
  {
    "id": "SC-INT-026",
    "badgeId": "SC-INT-026",
    "name": "攝影",
    "en": "Photographer",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "完成 (A) 攝影或 (B) 攝錄其中一項。(A) 出示十二幅個人作品（至少四種題材：人像、風景、童軍活動、街頭、運動、團體照或縮時），解釋技巧及意念；明瞭相機主要部分（快門、光圈、感光度、景深、焦距、解像度、壓縮格式）、配件及保養；用圖像處理軟件作曝光、色彩、剪裁調整；了解常見攝影／沖印錯誤。(B) 出示一段不少於五分鐘個人攝錄作品（教學短片、短劇、花絮、音樂短片或宣傳片）；明瞭攝錄機功能、預設設定問題、拍攝及製作技巧及保養。",
    "descEn": "Complete (A) Photography or (B) Videography. (A) Twelve personal photos across at least four subjects, explain techniques; camera parts (shutter, aperture, ISO, depth of field, focal length, resolution, compression), accessories and care; image editing for exposure/colour/cropping; avoid common errors. (B) A five-minute personal video plus camera functions, filming and editing basics and equipment care.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Photographer.pdf"
  },
  {
    "id": "SC-INT-027",
    "badgeId": "SC-INT-027",
    "name": "划艇",
    "en": "Rowing Boatman",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "持有本會有效游泳測試證明書；考獲中國香港賽艇協會二星單槳／雙槳賽艇技術評核證書或同等資歷（課程以該項運動所屬總會頒佈的最新課程為依歸）。",
    "descEn": "Hold a valid SAHK swimming test certificate and the Hong Kong, China Rowing Association 2-star sculling/sweep technique assessment certificate (or equivalent); follow the governing body's current syllabus.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/RowingBoatman.pdf"
  },
  {
    "id": "SC-INT-028",
    "badgeId": "SC-INT-028",
    "name": "風帆",
    "en": "Sailor",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "（興趣組風帆章）持有本會有效游泳測試證明書；考獲中國香港帆船運動總會一級風帆證書或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "(Interest Sailor) Valid SAHK swimming test certificate and the HK Sailing Federation Level 1 certificate (or equivalent) per the federation's current syllabus.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Sailor.pdf"
  },
  {
    "id": "SC-INT-029",
    "badgeId": "SC-INT-029",
    "name": "農務",
    "en": "Smallholder",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "認識本港農業發展、農場基本結構及每日每季工作（飼養牲口、種植農作物、耕種土地、農業機械）；認識新式耕作（魚菜共生、水耕、有機耕作）原理；種植一種植物並製作紀錄冊；辨認十種常見蔬菜，指出三種香港常見家種蔬果的特徵、環境要求及打理方法。",
    "descEn": "Hong Kong farming, farm structure and daily/seasonly work; modern methods (aquaponics, hydroponics, organic); grow a plant with a logbook; identify ten common vegetables and three home-grown crops with care notes.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Smallholder.pdf"
  },
  {
    "id": "SC-INT-030",
    "badgeId": "SC-INT-030",
    "name": "立划板",
    "en": "Stand Up Paddleboarder",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "持有本會有效游泳測試證明書；考獲中國香港獨木舟總會立划板二段章、少年立划板二段章證書或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "Stand Up Paddleboarder: valid SAHK swimming test certificate and the HK Canoe Union SUP Level 2 / junior SUP Level 2 certificate (or equivalent).",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/StandUpPaddleboarder.pdf"
  },
  {
    "id": "SC-INT-031",
    "badgeId": "SC-INT-031",
    "name": "立划板水球",
    "en": "Stand Up Paddling Polo",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "持有本會有效游泳測試證明書；考獲中國香港獨木舟總會立划板水球二段章證書、少年立划板水球二段章證書或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "Stand Up Paddling Polo: valid SAHK swimming test certificate and the HK Canoe Union SUP polo Level 2 certificate (or equivalent).",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/StandUpPaddlingPolo.pdf"
  },
  {
    "id": "SC-INT-032",
    "badgeId": "SC-INT-032",
    "name": "游泳",
    "en": "Swimmer",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "明瞭游泳安全守則；懂得使用基本游泳器材（水泡、浮床、救生衣等）；用任何方式游泳二百公尺；完成任何兩項（捷泳／背泳／胸泳／蝶泳各五十公尺）；池邊縱身下水；浮水五分鐘；從水面潛入兩公尺深水底以雙手找尋目的物並游回岸邊。",
    "descEn": "Swimming safety; basic aids; 200m any stroke; two of 50m front crawl/back/breastfly; dive entry; five minutes floating; retrieve an object from two metres depth.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Swimmer.pdf"
  },
  {
    "id": "SC-INT-033",
    "badgeId": "SC-INT-033",
    "name": "旅遊",
    "en": "Tourism",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "旅遊業知識：訪港旅客的需要期望、三個香港旅遊景點及分類、特色主題旅遊及主題旅遊點、中國傳統節日和香港獨有慶典、不同文化背景遊客的差異、旅遊業對香港經濟的影響。實習：以其他國家語言或方言介紹一處香港景點及一個中國傳統節日；編寫一天「特色主題旅遊」活動宣傳單張（簡介、行程、費用、圖片）。",
    "descEn": "Tourism knowledge: visitor needs, three attractions and categories, themed tourism, Chinese festivals and Hong Kong celebrations, cultural differences, economic impact. Practice: introduce an attraction and festival in another language; produce a one-day themed-tour leaflet.",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Tourism.pdf"
  },
  {
    "id": "SC-INT-034",
    "badgeId": "SC-INT-034",
    "name": "滑浪風帆",
    "en": "Windsurfer",
    "group": "interest",
    "groupName": "興趣組",
    "groupNameEn": "Interest Group",
    "icon": "🟢",
    "desc": "持有本會有效游泳測試證明書；考獲中國香港滑浪風帆會初級滑浪風帆證書或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "Windsurfer: valid SAHK swimming test certificate and the Hong Kong Windsurfing Association beginner certificate (or equivalent).",
    "assessedBy": "troop",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Windsurfer.pdf"
  },
  {
    "id": "SC-PUR-001",
    "badgeId": "SC-PUR-001",
    "name": "立體打印",
    "en": "3D Printing Technician",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "明瞭立體打印原理及材料選擇；明瞭笛卡爾坐標系 XYZ 型及三角型 Delta 立體打印機的操作原理及優缺點；學習任何一種立體設計軟件（建議 TinkerCAD）並設計一個水杯或容器；了解現今工商業的立體打印應用；利用軟件及打印機設計及打造一個獨特的童軍產品（如巾圈）並說明設計理念。",
    "descEn": "3D Printing: printing principles and materials; Cartesian vs Delta printers; design a cup/container in 3D software; industry applications; design and print a unique Scout product.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/3DPrintingTechnician.pdf"
  },
  {
    "id": "SC-PUR-002",
    "badgeId": "SC-PUR-002",
    "name": "沿繩下降",
    "en": "Abseiler",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "持有其中一項：中國香港攀山及攀登總會一級繩索技術訓練證書；香港繩索總會初級繩索技術證書；中國香港挑戰網陣協會康樂緣繩下降技術證書；或完成：繩索運動安全要點、個人保護裝備及雙重覆檢、器材認識、場地守則及口號、六種繩結（反手結、八字結、稱人結、單圈八字結、漁翁結、普式結）、安全防禦措施（頂繩／下拉繩／個人垂降防護）、八字環下降器設置及安全下降制停鎖繩。",
    "descEn": "Abseiler: hold an accepted rope-technique certificate (HKMGA/HKRA/Association of Challenge Courses), or demonstrate safety, PPE, equipment, knots, belay methods and figure-of-eight descender control.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Abseiler.pdf"
  },
  {
    "id": "SC-PUR-003",
    "badgeId": "SC-PUR-003",
    "name": "射箭",
    "en": "Archery",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "完成 (A) 至 (D) 其中一項：(A) 明瞭弓箭類別及各部分名稱、裝拆保養、正確姿勢、熱身緩和、安全守則、比賽規則衣著、計分升級制度；使用反曲弓於18米及25米（或複合弓30米及40米）各射36枝箭總分300環或以上。(B) 參加認可初級訓練班及最少一次公開比賽總分300環或以上。(C) 參加三次認可比賽每次300環或以上。(D) 參加認可比賽並成功晉組。",
    "descEn": "Pursuit Archery: complete one of — (A) knowledge plus 300+ points at set distances; (B) an approved beginners course plus one open tournament 300+; (C) three approved tournaments 300+ each; (D) promoted at an approved tournament.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Archery.pdf"
  },
  {
    "id": "SC-PUR-004",
    "badgeId": "SC-PUR-004",
    "name": "天象",
    "en": "Astronomer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "概述中國及西方星座、日月恆星行星在天球上的運動及季節交替；說出月相、日食、月食、流星及流星雨的成因特性及觀測方法；對太陽系主要成員及宇宙結構有基本認識；明瞭觀星禮儀、光污染影響及香港觀星地點；示範安全觀測太陽方法；說出天文望遠鏡功用及原理；參加一次晚間戶外觀星（用旋轉星圖辨別三個或以上星座並以星座辨向）；參加一次特別天文現象觀測或完成一個月月相觀測紀錄。",
    "descEn": "Astronomer: constellations and celestial motions; moon phases, eclipses, meteors; solar system and universe; light pollution and sites; safe solar viewing; telescopes; one night stargazing with a planisphere and one special-event or month-long observation log.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Astronomer.pdf"
  },
  {
    "id": "SC-PUR-005",
    "badgeId": "SC-PUR-005",
    "name": "航空領航",
    "en": "Aviation Navigator",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "對航空圖種類、比例與標示有基本認識；利用飛行計算尺按航線、風速、風向計算飛機航向；明瞭 VOR、DME、GPS 等導航儀器的應用；認識 NOTAM 內容及用途；按主考要求配合 NOTAM 及航空圖製作一份不少於五十海里、四個以上航程點的目視或儀表飛行計劃書；按計劃書擔任一次模擬飛行領航員。",
    "descEn": "Aviation Navigator: charts, flight computer wind correction, VOR/DME/GPS, NOTAM; prepare a 50+ NM VFR/IFR flight plan with four waypoints and act as navigator on one simulator flight.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/AviationNavigator.pdf"
  },
  {
    "id": "SC-PUR-006",
    "badgeId": "SC-PUR-006",
    "name": "原野烹飪",
    "en": "Backwoods Cook",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "解釋「燃燒四面體」原理；懂得選擇合適天然燃料；示範正確使用潛在危險工具；示範搭建柴架；以不多於十支火柴在二十分鐘內用天然物料生火；以原野烹飪方法（不用炊具）煮熟四種食物（薯仔蛋或洋蔥蛋、麵包、雞肉、魚、飯、水、蛋糕或相若食物）；認識野外生火安全守則。",
    "descEn": "Backwoods Cook: fire tetrahedron, natural fuel, safe tool use, a wood fire built in 20 minutes with ≤10 matches, cook four foods without utensils, and fire safety.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/BackwoodsCook.pdf"
  },
  {
    "id": "SC-PUR-007",
    "badgeId": "SC-PUR-007",
    "name": "露營",
    "en": "Camper",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "曾以童軍身份在三個或以上不同地方露營八晚或以上；明瞭選擇營地、營地衛生整潔安全及意外處理；策劃及執行最少兩日一夜小隊固定露營：收拾背囊、營區分佈、爐具使用清理、危險工具、食物貯藏、衛生整潔、四項檢查、常用繩結、營地建設項目（營門、圍欄、旗架、住宿營、貯物營、工作檯、紗櫃、飯桌、衣鞋架、廢物處理、天幕、告示板）、架搭拆卸兩種營帳、設計烹調三餐、撰寫計劃書及報告書。",
    "descEn": "Camper: eight+ camp nights at three+ sites; site choice, hygiene and safety; plan and run a two-day patrol camp — packing, layout, stoves, tools, food, inspections, knots, camp constructions, two tent types, three meals, plan and report.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Camper.pdf"
  },
  {
    "id": "SC-PUR-008",
    "badgeId": "SC-PUR-008",
    "name": "獨木舟",
    "en": "Canoeist",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "持有本會有效游泳測試證明書；考獲中國香港獨木舟總會中級銀章證書或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "Canoeist: valid SAHK swimming test certificate and the Hong Kong Canoe Union Intermediate Silver badge (or equivalent) per the union's current syllabus.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Canoeist.pdf"
  },
  {
    "id": "SC-PUR-009",
    "badgeId": "SC-PUR-009",
    "name": "獨木舟水球",
    "en": "Canoe Polo",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "持有本會有效游泳測試證明書；考獲中國香港獨木舟總會初級獨木舟水球球員證書／獨木舟水球二段章／少年獨木舟水球球員深造證書或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "Canoe Polo: valid SAHK swimming test certificate and the HK Canoe Union beginner canoe polo player certificate / level-2 badge (or equivalent).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/CanoePolo.pdf"
  },
  {
    "id": "SC-PUR-010",
    "badgeId": "SC-PUR-010",
    "name": "攀登",
    "en": "Climber",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "持有中國香港攀山及攀登總會一級運動攀登訓練證書或一級攀岩訓練證書；並進行其中一項：參與一次運動攀登比賽；或在兩個不同場地（天然岩壁或人工牆）以頂繩防護法攀登並完成至少三條攀登路線。",
    "descEn": "Climber: HKMGA Level 1 sport climbing or rock climbing certificate, plus one climbing competition or three top-rope routes at two different venues.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Climber.pdf"
  },
  {
    "id": "SC-PUR-011",
    "badgeId": "SC-PUR-011",
    "name": "通訊",
    "en": "Communicator",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "完成 (A) 或 (B)。(A) 旗語每分鐘45字母及摩士訊號（發報機或訊號燈）每分鐘25字母收發150字母訊息（或發報機40／訊號燈30字母）；示範收發訊步驟；150公尺外以兩種方法每分鐘20字母發訊（80%準確）。(B) 業餘無綫電：三個月內紀錄50個電台並與考驗員討論；討論各頻帶及日夜頻率範圍；解說十二個「Q」訊息；清楚香港電訊管理局對手提對講機的規定。",
    "descEn": "Communicator: (A) semaphore/Morse sending and receiving at set rates over 150m with 80% accuracy, or (B) amateur radio — log 50 stations in three months, frequency bands, twelve Q-codes and HK telecoms rules.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Communicator.pdf"
  },
  {
    "id": "SC-PUR-012",
    "badgeId": "SC-PUR-012",
    "name": "烹飪",
    "en": "Cook",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "知曉普通烹飪名詞（爆、醃、過冷河、慢火煮、炆、拌碟）；明瞭及示範烹飪時的安全、整潔及衛生習慣；懂得明火烹煮米飯；選取一種菜系設計及製作包括湯及甜品的五道菜式（須包含三種不同烹調方式：煎炒炸炆燉焗蒸等）；介紹菜式煮法、營養及擺盤技巧；撰寫烹調工作流程或分工表。",
    "descEn": "Cook: cooking terms, safety and hygiene, cook rice over open flame; design and make five dishes (soup and dessert, three methods) from one cuisine; explain nutrition and plating; write a workflow.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Cook.pdf"
  },
  {
    "id": "SC-PUR-013",
    "badgeId": "SC-PUR-013",
    "name": "手藝",
    "en": "Craftsman",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "完成 (A) 至 (G) 其中一項：(A) 籐工——編織一實用物件並認識原料；(B) 釘書——線帶釘裝、黏上空頁、硬紙板書面釘裝成冊；(C) 木工——旋螺絲、釘木箱蓋、縱鋸木板、磨鑿刨、入榫接合、分辨本地木材；(D) 皮工——釘縫鞋底或製作皮具、認識工具及皮革；(E) 金工——以銅片鐵片製作物件、工具用法、釬料鎔接劑、做有蓋鐵罐；(F) 印刷——排版印刷、字粒系統及六種字體、改正符號及紙張；(G) 絲網印刷——製作網架、拉網上架、製版、用料、膠刮運用、三色印法。",
    "descEn": "Craftsman: complete one of rattan work, bookbinding, woodwork, leatherwork, metalwork, printing or screen printing — each with its listed practical items and knowledge.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Craftsman.pdf"
  },
  {
    "id": "SC-PUR-014",
    "badgeId": "SC-PUR-014",
    "name": "數據分析",
    "en": "Data Analyst",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "解說平均數、眾數、中位數、四分位數；明瞭箱形圖及 csv 檔案格式；指出影響資料真確性的因素並分辨真確性及可靠程度；分辨一手及二手資料；明白焦點小組、問卷及訪問等收集方法；運用圓形圖、棒形圖等匯報數據；從數據整合趨勢及作出結論；完成一項簡單數據分析事工（目的、收集方式、一手／二手來源、數據匯報、合適圖表、不少於三項個人見解）。",
    "descEn": "Data Analyst: averages and quartiles, box plots, CSV, data reliability, primary/secondary data, collection methods, charts, trends; plus one analysis project with at least three personal insights.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/DataAnalyst.pdf"
  },
  {
    "id": "SC-PUR-015",
    "badgeId": "SC-PUR-015",
    "name": "電子",
    "en": "Electronics",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "認識可編程實體物件、單板微控制器、輸入輸出設備及日常例子；明瞭條件句式、循環等程序結構、數碼與模擬訊號的區別、各種傳感器的用途及原理、物聯網概念及應用。實習：介紹 Arduino 或 micro:bit、麵包板及電子元件；用編程環境構建簡單電路（如 LED 閃爍）；用模擬輸入輸出（PWM）構建控制電路；用條件句式及循環設計電路；用無線模組（Bluetooth/Wi-Fi/Zigbee）構建無線通訊電路；設計一個應用於童軍活動的專案並說明理念。",
    "descEn": "Electronics: programmable objects, microcontrollers, I/O, program structures, digital vs analogue signals, sensors, IoT; practicals with Arduino/micro:bit — simple circuit, PWM control, wireless link and a Scouting project.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Electronics.pdf"
  },
  {
    "id": "SC-PUR-016",
    "badgeId": "SC-PUR-016",
    "name": "探險",
    "en": "Explorer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "完成 (A) 本會「基本遠足訓練班」；或 (B) 考獲地圖閱讀章，明瞭郊野探險基本技巧（裝備、策劃計劃書、事工計劃、露營技巧、食物炊事、登山技巧、戶外活動守則、急救及安全、天氣、旅程安全及意外處理、報告書製作），並完成一次兩日一夜不少於二十公里的陌生郊野荒野探險旅程並完成一項事工（必須徒步）。",
    "descEn": "Explorer: (A) the Association's Basic Hiking course, or (B) Map Reader badge, backcountry skills, and a two-day 20+ km wilderness journey on foot completing one project.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Explorer.pdf"
  },
  {
    "id": "SC-PUR-017",
    "badgeId": "SC-PUR-017",
    "name": "模擬飛行",
    "en": "Flight Simulator",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "明瞭飛行模擬器硬件的安裝、收納及保養；用認可飛行模擬器：累積不少於十次共十八小時模擬飛行並保存個人紀錄冊；模擬駕駛單引擎小型飛機或直昇機完成一次目視五邊飛行；並完成其中一項——示範基本飛行通訊（ATIS、滑行、出發許可、進場／離場許可）／填寫 DCA 6b 表格並按表飛行／撰寫半小時跨越國土目視飛行計劃並按計劃飛行／閱讀電子飛行儀表並運用飛行管理系統（FMS）。",
    "descEn": "Flight Simulator: hardware setup and care; 10+ sessions totalling 18 hours with a logbook; a simulated VFR five-leg flight; plus one of radio phraseology, DCA 6b form, a cross-country flight plan, or airliner FMS work.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/FlightSimulator.pdf"
  },
  {
    "id": "SC-PUR-018",
    "badgeId": "SC-PUR-018",
    "name": "步操",
    "en": "Footdrill",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "主考須持有助理步操教練員或以上資格。完成 (A) 總會、地域或區會舉辦之童軍步操基本訓練班；或 (B) 明瞭步操述語及步速步幅；正確做出立定及快步步操動作（立正、稍息、休息、轉向、敬禮、行注目禮、原地踏步等）及排列隊形（報數排列、三排轉兩排、睇齊、開闊收窄排、解散）；明瞭會操程序（進場、檢閱、操過檢閱台、最高致敬、離場）；並參加一次會操或步操比賽。",
    "descEn": "Pursuit Footdrill: examiner holds a drill instructor qualification; (A) a basic footdrill course or (B) drill terms and all halt/quick-time/formation movements, parade procedure, and one parade or competition.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Footdrill.pdf"
  },
  {
    "id": "SC-PUR-019",
    "badgeId": "SC-PUR-019",
    "name": "獨木舟國際賽艇",
    "en": "International Racing Kayak",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "舊版「獨木舟國際賽艇」章，屬獨木舟賽艇範疇；不在2026年修訂版技能組列表內（現行設「獨木舟」及「獨木舟水球」章）。保留既有紀錄之用。",
    "descEn": "Legacy Canoe International Racing badge; the 2026 Pursuit list has Canoe and Canoe Polo. Kept for existing records.",
    "assessedBy": "member",
    "sourceUrl": "https://www.scout.org.hk/"
  },
  {
    "id": "SC-PUR-020",
    "badgeId": "SC-PUR-020",
    "name": "地圖繪製",
    "en": "Map Maker",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "以測量方法（Radiation、Intersections、Resections）在一千平方米地方繪製 1:200 地圖；以 1:2000 繪製五百米道路地圖（包括兩旁兩米突出物體）；將 1:1000 地圖某部分放大為 1:200；繪畫 1:5000 地圖的簡單橫切面圖；簡單匯報香港現時地圖繪製方法（電子地圖、地理資訊系統）。",
    "descEn": "Map Maker: survey a 1,000 m² area to 1:200 using radiation/intersections/resections; a 500 m road at 1:2000; enlarge 1:1000 to 1:200; a cross-section at 1:5000; brief on digital mapping/GIS.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/MapMaker.pdf"
  },
  {
    "id": "SC-PUR-021",
    "badgeId": "SC-PUR-021",
    "name": "地圖閱讀",
    "en": "Map Reader",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "明瞭地圖閱讀基本技巧：地圖認識及保養、比例及距離、習用圖例、坐標系統、方向及北的認識、指南針的應用、等高線與地形、指南針運用技巧；完成不少於兩次（共不少於十二小時）野外實習，內容須包括以上各項技巧的實地應用。",
    "descEn": "Map Reader: map care, scale and distance, legend, grid references, directions, compass use, contours and terrain; two+ field sessions totalling 12+ hours applying all skills.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/MapReader.pdf"
  },
  {
    "id": "SC-PUR-022",
    "badgeId": "SC-PUR-022",
    "name": "射擊",
    "en": "Marksman",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "認識香港《火器及彈藥條例》、氣槍射擊安全守則、所用氣槍的構造保養維修；完成認可射擊會主辦的氣槍射擊訓練，或加入射擊會並於三個月內在認可靶場練習不少於十次；在十米氣槍靶場按 ISSF 規則四十發內取得 280 环或以上，或在 IPSC 靶場按實用射擊安全規則二十發內十六槍中靶並無取消資格（成績須由靶場主任、槍械導師或教練簽署）。考驗須向總會青少年活動署申請。",
    "descEn": "Marksman: firearms ordinance and air-rifle safety, rifle care; approved training or ten range sessions in three months; 280/400 on a 10m ISSF target or an IPSC qualification; signed proof; apply via the Association.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Marksman.pdf"
  },
  {
    "id": "SC-PUR-023",
    "badgeId": "SC-PUR-023",
    "name": "技擊",
    "en": "Master-at-arms",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "對下列其中一項有相當造詣：刀法、棍法、劍擊、拳術、柔道、摔角或中外武術；按時接受所選項目的訓練三個月以上；示範所選項目之正確進攻及防守方法。",
    "descEn": "Master-at-arms: real proficiency in one of fencing, stick, swordplay, boxing, judo, wrestling or martial arts; three+ months of training; demonstrate attack and defence.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Master-at-arms.pdf"
  },
  {
    "id": "SC-PUR-024",
    "badgeId": "SC-PUR-024",
    "name": "機械",
    "en": "Mechanic",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "完成 (A) 或 (B)。(A) 認識內燃機原理及離合器、波箱、尾軸作用；拆除清理火咀並檢查寬度；清理安裝分火點及分火次序；分辨保險絲電路及為電池充電；檢查注入摩托油；拆除更換車胎及預防措施。(B) 安裝一部最少兩個半導體的無線電收音機（不用現成套件）並畫出線路圖解釋各部分；正確使用小型接釬器及留意釬接晶體印刷電路要點；明瞭交流電收音機安裝的特別小心之處；修理家庭收音機簡單毛病；簡述無線電控制模型、業餘無線電轉播、家庭無線電收發牌照條件。",
    "descEn": "Mechanic: (A) car engine/service basics — spark plugs, distributor, fuses, battery, oil, tyres; or (B) build a two-transistor radio without a kit, soldering skills, mains safety, simple repairs, radio licensing brief.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Mechanic.pdf"
  },
  {
    "id": "SC-PUR-025",
    "badgeId": "SC-PUR-025",
    "name": "氣象",
    "en": "Meteorologist",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "（技能組氣象章）明瞭天氣要素、雲的形成及十種基本雲層；閱讀地面天氣圖及等壓線圖簡述天氣概況；明瞭四季成因、天氣與氣候分別、本港氣候、天氣術語及警告定義、獲取天氣資訊方法；明瞭天氣對童軍活動的影響及應變；認識人類活動對氣候變化的影響並建議綠色童軍生活；利用童軍自動氣象站資料記錄一週天氣並解釋變化趨勢。（與興趣組「氣象」章同名；考驗以技能組要求為準。）",
    "descEn": "Pursuit Meteorologist: weather elements and clouds, surface charts, seasons, Hong Kong climate and warnings, weather information and activity contingency, climate change, and a one-week weather-station log. (Same name as the Interest badge; assess to the Pursuit requirements.)",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Meteorologist.pdf"
  },
  {
    "id": "SC-PUR-026",
    "badgeId": "SC-PUR-026",
    "name": "多媒體創作",
    "en": "Multimedia Designer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "用圖像處理軟件完成其中兩項並分享設計理念：為童軍活動設計兩項宣傳品；設計兩款活動紀念章；為旅團網頁或社交平台設計三個資訊圖表；或為旅團網頁設計使用者介面（UX）。製作兩條不同類型的短片（紀錄片、短劇、微電影、vlog、宣傳片、花絮或教學短片），每條與童軍活動有關及不少於五分鐘，包含不同場景、字幕、對白／旁白、音效及視覺特效。",
    "descEn": "Multimedia Designer: two graphic-design items (promotions, badge designs, infographics or UX) plus two five-minute Scout videos of different types with scenes, subtitles, audio and effects.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/MultimediaDesigner.pdf"
  },
  {
    "id": "SC-PUR-027",
    "badgeId": "SC-PUR-027",
    "name": "領航",
    "en": "Navigator",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "明白 1:20,000 地圖中比例、座標、正北、圖北、磁北及等高線的作用；對道路交通圖的交通標誌有基本認識；預備一幅八十公里路程的道路圖給駕駛者使用；坐於駕駛者旁擔任領途者作一百公里旅程（一半以上在快速公路外，汽車道路不多於32公里；可用電單車或其他交通工具）；參加一項有組織之野外定向活動。",
    "descEn": "Navigator: map scale/grid/norths/contours at 1:20,000, road signs; prepare an 80 km route map; navigate a 100 km journey as front-seat navigator; join one organised orienteering event.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Navigator.pdf"
  },
  {
    "id": "SC-PUR-028",
    "badgeId": "SC-PUR-028",
    "name": "觀察",
    "en": "Observer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "在金氏遊戲中一分鐘觀察三十種物件並記出其中二十四件（測驗兩次，每次不同物件）；聽十種簡單音響辨認其中八種；對一件不短於一分鐘、涉及三人的事件作準確口述或書面報告（包括對指定一人的詳細描述）；做六個鳥類、動物、汽車或單車痕跡的石膏印模（至少兩個為鳥獸足跡，並列明日期地點）；在郊野追蹤一段一點五公里、約四十個天然符號的路程。",
    "descEn": "Observer: Kim's game (24/30 twice), identify 8/10 sounds, report a three-person incident, six plaster casts of tracks (two wildlife), and follow a 1.5 km trail with 40 natural signs.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Observer.pdf"
  },
  {
    "id": "SC-PUR-029",
    "badgeId": "SC-PUR-029",
    "name": "野外定向",
    "en": "Orienteer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "完成 (a) 總會、地域或區會舉辦之野外定向專章訓練班；(b) 持有中國香港定向總會野外定向第一階段訓練班證書；或 (c) 認識歷史形式、裝備、地圖比例等高線顏色圖例、國際控制點提示符號表、用指南針及地貌正置地圖、3S／拇指輔行法／扶手法／沿途搜集特徵、比賽類型程序規則、安全措施，並描述地圖上不少於五百米路程。完成一場越野式野外定向比賽（總會／地域／區會舉辦或中國香港定向總會認可公開賽；雙人組、體驗組、公園定向及短途定向賽不計算）。",
    "descEn": "Orienteer: an orienteering course, HKOF Stage 1 certificate, or the listed skills; plus one cross-country orienteering race (certain events excluded).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Orienteer.pdf"
  },
  {
    "id": "SC-PUR-030",
    "badgeId": "SC-PUR-030",
    "name": "先鋒工程",
    "en": "Pioneer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "完成 (A) 本會認許之先鋒工程訓練班；或 (B) 認識繩纜特性、保養綑捲及估計承受力量；認識危險成因（漠視指示、不守紀律、工具誤用、繩結錯誤等）及人造纖維繩裂斷危險；明瞭及示範各類樁躉用法（含鬆土及沼澤）；認識並示範二十種繩結編結；與三至四位同伴合作按圖片完成一項先鋒工程並施行安全措施；獨自設計一項先鋒工程（用途、圖則、程序、材料、工具、時間須與主考討論）並製作比例模型（兩項須為不同類工程）。",
    "descEn": "Pioneer: (A) an approved course, or (B) rope knowledge and care, hazards, stakes and lashings, twenty knots, one team structure from a picture, and one self-designed structure with a scale model.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Pioneer.pdf"
  },
  {
    "id": "SC-PUR-031",
    "badgeId": "SC-PUR-031",
    "name": "編程",
    "en": "Programmer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "學習使用任何一個整合開發環境編寫應用程式或網頁（iOS、Android 或其他平台）；學習任何一種程式語言（如 Python、JavaScript、C++），包括資料型別、數學運算、邏輯運算、條件句式、循環；實習：設計編寫一個多畫面、聲音及數據輸入輸出功能的程式；設計編寫一個適合童軍活動中應用的簡單遊戲程式，收集用戶用後感並提出改善建議。",
    "descEn": "Programmer: use an IDE to build apps or web pages; one language (Python/JavaScript/C++ etc.) with data types, arithmetic, logic, conditionals and loops; build a multi-screen program and a Scouting game with user feedback.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Programmer.pdf"
  },
  {
    "id": "SC-PUR-032",
    "badgeId": "SC-PUR-032",
    "name": "風帆賽艇舵手",
    "en": "Race Helmsman",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "舊版「風帆賽艇舵手」章；不在2026年修訂版技能組列表內（現行設「風帆」章，考獲中國香港帆船運動總會證書）。保留既有紀錄之用。",
    "descEn": "Legacy Sailing Race Helmsman badge; the 2026 list has Sailor (HKSF certificate). Kept for existing records.",
    "assessedBy": "member",
    "sourceUrl": "https://www.scout.org.hk/"
  },
  {
    "id": "SC-PUR-033",
    "badgeId": "SC-PUR-033",
    "name": "風帆",
    "en": "Sailor",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "持有本會有效游泳測試證明書；考獲中國香港帆船運動總會二級風帆證書或同等資歷（以該總會最新課程為依歸）。",
    "descEn": "Sailor: valid SAHK swimming test certificate and the HK Sailing Federation Level 2 certificate (or equivalent) per the federation's current syllabus.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Sailor.pdf"
  },
  {
    "id": "SC-PUR-034",
    "badgeId": "SC-PUR-034",
    "name": "徒手潛水",
    "en": "Skin Diver",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "安全及正確使用徒手潛水儀器並熟悉個人潛水儀器（泳池或平靜開放水域）；無儀器游泳最少五十公尺；明瞭特深呼吸的潛在危險、壓力改變對潛水員的影響、徒手潛水技術及儀器運用；熟悉儀器運用及保養、水面及水底保持中性浮量、掌握徒手潛水技術、懂得水中自救及拯救其他潛水員、遵守安全規則。持有本港認可徒手潛水證書者可由獲授權人士直接簽發。",
    "descEn": "Skin Diver: safe equipment use, 50 m unaided swim, breath-hold risks and pressure effects, neutral buoyance, techniques, self/buddy rescue, safety rules; recognised certificates may be signed off directly.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/SkinDiver.pdf"
  },
  {
    "id": "SC-PUR-035",
    "badgeId": "SC-PUR-035",
    "name": "艇長",
    "en": "Skipper",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "已考獲水手章。繩索技能：認識繩索用途拉力韌力；示範收捲、盤繞、拴住、懸掛；七種繩結及四種織結（含嵌環鳳眼織結）；拋救生繩二十米。索具技能：固定及活動索具、兩種起重索具、機械利益。帆工技能：帆布尼龍帆的認識保養、用縫帆掌革及縫帆針製造一海錨。並參與下列一項：建造獨木舟或小艇／修理船身／檢查修理童軍標準艇索具及帆；負責領導兩項練習：放出收回海錨、拉艇上沙灘（抓地滑車組）、裝臨時桅杆或船舵、錨泊工作。",
    "descEn": "Skipper: Boatman badge; rope, rigging and sail skills (knots, splices, heaving line, tackle, sail care and a canvas sea anchor); one boatbuilding/repair activity and lead two of the listed seamanship drills.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Skipper.pdf"
  },
  {
    "id": "SC-PUR-036",
    "badgeId": "SC-PUR-036",
    "name": "體育",
    "en": "Sportsman",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "對隊際及個人活動（球類、田徑、單車、游泳、溜冰等）的規則有良好認識；做一個有良好體育精神、熟練技巧及熱心於一項個人和一項隊際運動的運動員；與主考討論體育活動的好處及所選兩種體育活動的歷史；認識兩位國際或本地知名運動員並討論他們的動態及曾研究的事情。",
    "descEn": "Sportsman: rules of team and individual sports; be a good-sportsman participant in one individual and one team sport; discuss benefits and the history of two sports; know two famous athletes.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/Sportsman.pdf"
  },
  {
    "id": "SC-PUR-037",
    "badgeId": "SC-PUR-037",
    "name": "樹木護理",
    "en": "Tree Carer",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "辨識及製作紀錄冊記錄十種香港常見樹木品種；認識樹木在大自然及市區的作用和重要性、樹木基本知識；辨識常見的樹木健康及結構問題；認識妥善護理樹木的重要性；記錄住所／旅部附近休憩設施內的樹木；製作一個護樹報告。",
    "descEn": "Tree Carer: logbook of ten Hong Kong tree species, trees' roles in nature and the city, basic arboriculture, health and structural problems, tree care importance, record nearby trees and produce a tree-care report.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Interest/TreeCarer.pdf"
  },
  {
    "id": "SC-PUR-038",
    "badgeId": "SC-PUR-038",
    "name": "國際友誼",
    "en": "World Friendship",
    "group": "pursuit",
    "groupName": "技能組",
    "groupNameEn": "Pursuit Group",
    "icon": "🔵",
    "desc": "認識世界童軍組織及亞太區童軍組織的架構、功能、職責及活動；搜集四個國家／地區童軍組織資料並與本會比較呈交報告。參與國際童軍活動或通訊完成其中兩項：與外地童軍露營或遠足七天以上；探訪香港以外的童軍旅團；出示三十張外地童軍照片；持續與外地童軍通訊六個月並彙編報告；參與世界童軍組織國際電訊日。國際友誼服務完成其中一項：製作五分鐘分享影片；組織一個團／小隊活動；為在港國際童軍活動擔任工作人員；款待外國童軍訪客並作報告。",
    "descEn": "(Service) World Friendship Ambassador: WOSM/APR structure; compare four national Scout organisations; two international activities (camp/hike 7 days, overseas troop visit, 30 photos, 6-month correspondence, JOTA); one friendship service (video, activity, event staffing, hosting).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/WorldFriendshipAmbassador.pdf"
  },
  {
    "id": "SC-SER-001",
    "badgeId": "SC-SER-001",
    "name": "愛護動物",
    "en": "Animal Carer",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "完成下列其中一項：考獲動物飼養章（興趣組），或了解一隻寵物的基本資料及日常照顧需要並向主考報告其成長、飼養及訓練過程及生活習慣；明瞭動物福利、保護動物法例、遺棄寵物原因、香港動物福利機構工作，參觀動物福利機構／診所，探討一則動物福利時事並提出改善方法，認識尊重野生動物及面對時如何保護自己；參與至少一次愛護動物相關義工服務（總時數不少於六小時）。",
    "descEn": "(Service) Animal Carer: pet-keeping knowledge or the Petkeeper badge; animal welfare, laws, abandonment, HK welfare organisations, a clinic visit, a current-issue discussion, wildlife respect; at least six hours of related volunteer service.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/AnimalCarer.pdf"
  },
  {
    "id": "SC-SER-002",
    "badgeId": "SC-SER-002",
    "name": "營地管理",
    "en": "Camp Warden",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "舊版「營地管理」章（服務組）；不在2026年修訂版服務組列表內。保留既有紀錄之用。",
    "descEn": "Legacy Camp Management badge (Service); not on the 2026 list. Kept for existing records.",
    "assessedBy": "member",
    "sourceUrl": "https://www.scout.org.hk/"
  },
  {
    "id": "SC-SER-003",
    "badgeId": "SC-SER-003",
    "name": "獨木舟救生",
    "en": "Canoe Rescuer",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "舊版「獨木舟救生」章（服務組）；不在2026年修訂版服務組列表內（拯溺章涵蓋救生訓練）。保留既有紀錄之用。",
    "descEn": "Legacy Canoe Life Saving badge (Service); not on the 2026 list. Kept for existing records.",
    "assessedBy": "member",
    "sourceUrl": "https://www.scout.org.hk/"
  },
  {
    "id": "SC-SER-004",
    "badgeId": "SC-SER-004",
    "name": "公民",
    "en": "Civics",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "完成本會認許之公民章訓練班；或明瞭祖國及香港特區的歷史文化、地理、公共行政、中央與特區關係、基本法、行政立法司法制度及政府架構；認識社區、社區設施及組織支援、區議會、義務工作；認識公民權利義務、價值觀態度及公民教育委員會。專題研習：編寫社區參與服務計劃書並完成不少於兩小時實際服務，或參與實際社區參與服務不少於六小時，完成後呈交報告。",
    "descEn": "(Service) Civics: an approved course, or knowledge of China/HKSAR institutions and Basic Law, community organisations and District Council, civic rights and duties; then a community service project (2h planned or 6h arranged) with a report.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Civics.pdf"
  },
  {
    "id": "SC-SER-005",
    "badgeId": "SC-SER-005",
    "name": "護養",
    "en": "Conservator",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "舊版「護養」章（服務組）；不在2026年修訂版服務組列表內。保留既有紀錄之用。",
    "descEn": "Legacy Upkeep badge (Service); not on the 2026 list. Kept for existing records.",
    "assessedBy": "member",
    "sourceUrl": "https://www.scout.org.hk/"
  },
  {
    "id": "SC-SER-006",
    "badgeId": "SC-SER-006",
    "name": "網絡安全",
    "en": "Cybersecurity Analyst",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "明瞭資料外泄及身分盜竊的風險因素、影響及防範應對；明瞭安裝手機程式的資訊保安風險及保護流動裝置和電腦；認識反追蹤方法（無痕模式、Cookies）；認識網絡安全概念（VPN、多重要素驗證、防火牆、WPA2、AES、SSL、TLS、端到端加密）；認識常見電腦病毒或攻擊（釣魚、DDoS、木馬、蠕蟲）及防範應對；明瞭域名系統（DNS）運作及 DNSSEC 的保護；向隊員分享一個重大網絡安全事故及網絡安全的重要性；示範設立一個路由器。",
    "descEn": "(Service) Cybersecurity Analyst: data leaks and identity theft, app/device security, anti-tracking, VPN/MFA/firewall/encryption concepts, common attacks and defences, DNS/DNSSEC, share a major incident, set up a router.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/CybersecurityAnalyst.pdf"
  },
  {
    "id": "SC-SER-007",
    "badgeId": "SC-SER-007",
    "name": "多元共融",
    "en": "Diversity & Inclusion",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "認識特能童軍活動；多元與共融的基本概念及個人差異；世界童軍及本會的多元共融政策、平等機會條例；尊重與平等的實踐（推動共融、與殘疾人士溝通及協助、無障礙設施與科技、多元文化宗教性別家庭）。服務活動完成其中一項：舉辦或參與兩次推動共融與平等的社區服務／活動；或實地觀察一處無障礙設施並撰寫改善建議報告；或參與兩次與多元文化、性別平等、宗教或種族共融相關活動並報告。",
    "descEn": "(Service) Diversity & Inclusion: special-needs Scouting, D&I concepts, policies and equal-opportunity law, respectful practice; plus one of: two inclusion community activities, an accessibility audit report, or two multicultural/equality activities.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/DiversityAndInclusion.pdf"
  },
  {
    "id": "SC-SER-008",
    "badgeId": "SC-SER-008",
    "name": "消防",
    "en": "Fireman",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "完成 (A) 本會認許之消防訓練班；或 (B) 認識本地消防處工作、家庭設備危險性及防火措施、設計防火措施活動、露營起火危險及山火撲滅、火警時的行動及召喚消防車程序、樓宇消防裝備及各類滅火筒的使用、處理衣服著火者；運用椅結及雙稱人結並示範拖離昏迷者；闡釋燃燒原理及煙熱影響。",
    "descEn": "(Service) Fireman: (A) an approved fireman course, or (B) home fire hazards and prevention, campfire and hill-fire safety, fire actions and calling fire services, extinguisher types and use, rescuing an unconscious person with knots, combustion and smoke effects.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Fireman.pdf"
  },
  {
    "id": "SC-SER-009",
    "badgeId": "SC-SER-009",
    "name": "急救",
    "en": "First Aid",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "持有下列其中一項：本會之急救證書；香港聖約翰救護機構之基本急救證書；香港紅十字會之青少年急救證書；或本會認可之相等程度證書。",
    "descEn": "(Service) First Aider: hold one of — SAHK first aid certificate, St John Ambulance basic first aid, HK Red Cross youth first aid, or an equivalent accepted certificate.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/FirstAider.pdf"
  },
  {
    "id": "SC-SER-010",
    "badgeId": "SC-SER-010",
    "name": "指引",
    "en": "Guide",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "熟悉住所和旅部附近環境（市區半徑1.5公里／郊區3公里）；熟悉醫院診所、消防局警署、公共交通、童軍總部地域及區會、公園劇院教堂博物館郵局民政事務處公廁等名勝建築、區總監旅長團長及隊員住址；使用區內地圖指出任何六個地點並指出最快途徑；向乘交通工具者清楚指示前往童軍營地之路線。",
    "descEn": "(Service) Guide: know your neighbourhood (1.5km urban / 3km rural), key locations and addresses, use a district map to point out six places and fastest routes, and give clear directions to a Scout campsite.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Guide.pdf"
  },
  {
    "id": "SC-SER-011",
    "badgeId": "SC-SER-011",
    "name": "語言",
    "en": "Interpreter",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "用任何第二種語言進行測驗：與主考作最少十分鐘談話；寫一封約一百五十字以童軍為題材的文章；閱讀報章雜誌一段文字數分鐘後譯出大意；擔任傳譯員十分鐘。",
    "descEn": "(Service) Interpreter: in any second language — a ten-minute conversation, a 150-word Scouting essay, sight translation of a press passage, and ten minutes interpreting.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Interpreter.pdf"
  },
  {
    "id": "SC-SER-012",
    "badgeId": "SC-SER-012",
    "name": "工藝",
    "en": "Jobman",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "示範下列任何六項：修理或安裝窗簾繩、安裝玻璃、髹漆／牆紙裝飾、修補批盪、重裝門及修理門鎖、修理傢俬、舖行人路、清理及調較氣爐、修補衣服、洗車打蠟、修理閘或籬笆、混和三合土修補、修理玩具、舖地氈、換水喉皮、修理剪草機、水喉爆裂應變、更換保險絲及安裝插頭。",
    "descEn": "(Service) Jobman: demonstrate any six household skills from eighteen (curtains, glazing, painting, plastering, doors, furniture, paving, gas stoves, clothing, car care, fencing, concrete, toys, carpet, plumbing, mowers, burst pipes, fuses/plugs).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Jobman.pdf"
  },
  {
    "id": "SC-SER-013",
    "badgeId": "SC-SER-013",
    "name": "拯溺",
    "en": "Lifesaver",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "考獲童軍游泳章；並 (a) 考獲中國香港拯溺總會拯溺銅章；或 (b) 完成：陸上及水中示範拯溺方法、以拖身或拖頭拯救五十公尺外被溺者、從高處跳水游往二十公尺外使被溺者浮水兩分鐘、拋救生繩至十二公尺外兩柱間（三次中兩次）、以人體模型示範口對口人工呼吸。",
    "descEn": "(Service) Lifesaver: Swimmer badge plus the HK Life Saving Union Bronze Medallion, or the listed rescue drills (tows, deep jump, surface support, rope throw, artificial respiration).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Lifesaver.pdf"
  },
  {
    "id": "SC-SER-014",
    "badgeId": "SC-SER-014",
    "name": "精神健康",
    "en": "Mental Health Ambassador",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "完成 SOUL Keeper 精神健康守護者課程（Level 1）；或認識精神健康定義、情緒概念及調節方法、自我照顧及促進精神健康方法、關顧別人態度技巧（觀察關懷、積極聆聽、適當回應、求助轉介），並完成一星期情緒日記。認識常見精神健康問題及誤解、社區支援服務；探討青少年常見精神健康議題。完成其中兩項並報告：了解並支持兩位童軍或同學；設計推廣精神健康活動；參與精神健康體驗活動；參觀支援機構；參與精神健康相關服務。",
    "descEn": "(Service) Mental Health Ambassador: SOUL Keeper Level 1 or the listed self-study (emotions, self-care, caring skills, a week diary); know common conditions and supports; youth issues; plus two of: peer support, a promotion activity, an experience event, an agency visit, a service.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/MentalHealthAmbassador.pdf"
  },
  {
    "id": "SC-SER-015",
    "badgeId": "SC-SER-015",
    "name": "食物營養",
    "en": "Nutritionist",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "認識營養素、熱量、食物金字塔／我的餐碟飲食指引；認識食物營養標籤、均衡飲食及定時進餐、不同食物種類（有機、加工、基因改造等）、兩種食物安全處理方法、青少年成長的額外營養需要。專題研習完成其中兩項：設計及落實兩星期均衡餐單並作簡報；分析四種零食的熱量營養並分享；或分析至少四種飲食模式並研究如何達至均衡飲食。",
    "descEn": "(Service) Nutritionist: nutrients, calories, food pyramid/MyPlate, labels, balanced meals, food types, food safety, adolescent needs; plus two projects (two-week menu, snack analysis, or diet-pattern comparison).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Nutritionist.pdf"
  },
  {
    "id": "SC-SER-016",
    "badgeId": "SC-SER-016",
    "name": "領港",
    "en": "Pilot",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "已考獲水手章。理解：讀解羅盤（磁差及自差）、海圖符號略字、羅更、海圖基準及潮汐變化；各類浮泡、航標、燈塔、導航燈船隻及危險／颱風／霧訊號；氣壓計及蒲爾福風力表；1972年國際海上避碰規則及遇難信號；本地船艇規條。練習：完成一次本地水域航行及一次遮蔽水域黑夜航行（須海圖計劃）。服務：參加一次冒險航程擔任領航員，預先呈交航行摘要，完成後與主考討論航線。",
    "descEn": "(Service) Pilot: Boatman badge; compass, charts, tides, marks and signals, barometer/Beaufort, COLREGs 1972, local rules; a local passage and a night passage planned on charts; an adventure voyage as navigator with brief and debrief.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Pilot.pdf"
  },
  {
    "id": "SC-SER-017",
    "badgeId": "SC-SER-017",
    "name": "公共衞生",
    "en": "Public Health Ambassador",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "明瞭世衞對「公共衞生」及「健康」的定義；完成一項專題研習（比較兩間公共衞生政府機構／探討一項公共衞生政策／分享一次重大公共衞生事件）並分享；參加公共衞生相關機構的訓練、服務或工作坊並分享。健康體格：指導童軍考獲運動相關專科徽章不少於三個月／在團活動教授體適能三個月（每月兩次每次一小時）／拍攝體育或家居運動教學影片。均衡飲食：宣傳作品、營養餐單示範或推廣活動。心理健康：考獲精神健康章、基本心理支援術證書、分享抗壓方法或介紹常見精神疾病。",
    "descEn": "(Service) Public Health Ambassador: WHO definitions, a public-health study shared, an agency training/workshop; plus healthy body (coach sports badge / fitness sessions / teaching video), balanced diet (promo / menu / activity) and mental health (badge / psychological first aid / stress methods / awareness).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/PublicHealthAmbassador.pdf"
  },
  {
    "id": "SC-SER-018",
    "badgeId": "SC-SER-018",
    "name": "物資管理",
    "en": "Quartermaster",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "完成 (A) 或 (B)。(A) 曾有效率地協助旅／團物資管理員工作六個月或以上：繩索、營幕、工具、炊具爐具保養；物資貯存及借還紀錄；視聽教材保存；器材折舊；整齊管理。(B) 曾協助團部露營或幼童軍渡假營物資管理員工作五天或以上：營地用品保養、營地紀錄、特別設備保養、預備48小時露營菜單、食物貯藏、營具緊急修理工具表。",
    "descEn": "(Service) Quartermaster: (A) six months assisting a quartermaster — ropes, tents, tools, stoves care, stock/borrow records, AV gear, depreciation, tidiness; or (B) five days at a camp — camp equipment care, records, special gear, a 48h menu, food storage, emergency repair toolkit.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Quartermaster.pdf"
  },
  {
    "id": "SC-SER-019",
    "badgeId": "SC-SER-019",
    "name": "秘書",
    "en": "Secretary",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "認識童軍區和旅／團的行政及職責（小隊長會議、旅領袖會議、旅務委員會、區領袖會議、區務委員會）；良好書法抄寫二百五十字散文／打字一百字並懂得運用打字儀器／使用電郵平台撰寫發送回覆；掌握會議記錄、活動通告、計劃書報告書、請假申請表等文件格式；懂得 Word 排版插表、Excel 表格及簡單公式、PowerPoint 簡報及 Google Workspace 協作工具；認識旅部財政組織及準備進支一覽表；寫信及草擬請柬；認識郵費率；寫新聞報導或童軍刊物文章；擔任小隊／小隊長會議或其他團體秘書三個月以上。",
    "descEn": "(Service) Secretary: troop/district administration, handwriting/typing/email skills, standard documents (minutes, notices, proposals, forms), Word/Excel/PowerPoint/cloud tools, troop finances, letters and invitations, postage, reports/articles, and three months as a secretary.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/Secretary.pdf"
  },
  {
    "id": "SC-SER-020",
    "badgeId": "SC-SER-020",
    "name": "國際友誼",
    "en": "World Friendship Ambassador",
    "group": "service",
    "groupName": "服務組",
    "groupNameEn": "Service Group",
    "icon": "🔴",
    "desc": "認識世界童軍組織及亞太區童軍組織的架構、功能、職責及活動；搜集四個國家／地區童軍組織資料並與本會比較呈交報告。參與國際童軍活動或通訊完成其中兩項：與外地童軍露營或遠足七天以上；探訪香港以外的童軍旅團；出示三十張外地童軍照片；持續與外地童軍通訊六個月並彙編報告；參與世界童軍組織國際電訊日。國際友誼服務完成其中一項：製作五分鐘分享影片；組織一個團／小隊活動；為在港國際童軍活動擔任工作人員；款待外國童軍訪客並作報告。",
    "descEn": "(Service) World Friendship Ambassador: WOSM/APR structure; compare four national Scout organisations; two international activities (camp/hike 7 days, overseas troop visit, 30 photos, 6-month correspondence, JOTA); one friendship service (video, activity, event staffing, hosting).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Service/WorldFriendshipAmbassador.pdf"
  },
  {
    "id": "SC-INS-001",
    "badgeId": "SC-INS-001",
    "name": "釣魚",
    "en": "Angler",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-002",
    "badgeId": "SC-INS-002",
    "name": "抱石",
    "en": "Boulderer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-003",
    "badgeId": "SC-INS-003",
    "name": "營火",
    "en": "Campfire Host",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-004",
    "badgeId": "SC-INS-004",
    "name": "單車",
    "en": "Cyclist",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-005",
    "badgeId": "SC-INS-005",
    "name": "模型製作",
    "en": "Model Maker",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-006",
    "badgeId": "SC-INS-006",
    "name": "攝影",
    "en": "Photographer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-007",
    "badgeId": "SC-INS-007",
    "name": "風帆",
    "en": "Sailor",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。 風帆教導組須先考獲技能組「風帆」專章。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee. The Sailor instructor badge requires the Pursuit Sailor badge first.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-008",
    "badgeId": "SC-INS-008",
    "name": "游泳",
    "en": "Swimmer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-009",
    "badgeId": "SC-INS-009",
    "name": "天象",
    "en": "Astronomer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-010",
    "badgeId": "SC-INS-010",
    "name": "原野烹飪",
    "en": "Backwoods Cook",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-011",
    "badgeId": "SC-INS-011",
    "name": "露營",
    "en": "Camper",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-012",
    "badgeId": "SC-INS-012",
    "name": "通訊",
    "en": "Communicator",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-013",
    "badgeId": "SC-INS-013",
    "name": "烹飪",
    "en": "Cook",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-014",
    "badgeId": "SC-INS-014",
    "name": "手藝",
    "en": "Craftsman",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-015",
    "badgeId": "SC-INS-015",
    "name": "模擬飛行",
    "en": "Flight Simulator",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-016",
    "badgeId": "SC-INS-016",
    "name": "地圖繪製",
    "en": "Map Maker",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-017",
    "badgeId": "SC-INS-017",
    "name": "地圖閱讀",
    "en": "Map Reader",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-018",
    "badgeId": "SC-INS-018",
    "name": "機械",
    "en": "Mechanic",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-019",
    "badgeId": "SC-INS-019",
    "name": "氣象",
    "en": "Meteorologist",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-020",
    "badgeId": "SC-INS-020",
    "name": "多媒體創作",
    "en": "Multimedia Designer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-021",
    "badgeId": "SC-INS-021",
    "name": "觀察",
    "en": "Observer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-022",
    "badgeId": "SC-INS-022",
    "name": "野外定向",
    "en": "Orienteer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-023",
    "badgeId": "SC-INS-023",
    "name": "先鋒工程",
    "en": "Pioneer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-024",
    "badgeId": "SC-INS-024",
    "name": "編程",
    "en": "Programmer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-025",
    "badgeId": "SC-INS-025",
    "name": "樹木護理",
    "en": "Tree Carer",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-026",
    "badgeId": "SC-INS-026",
    "name": "護養",
    "en": "Conservator",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-INS-027",
    "badgeId": "SC-INS-027",
    "name": "拯溺",
    "en": "Lifesaver",
    "group": "instructor",
    "groupName": "教導組",
    "groupNameEn": "Instructor Group",
    "icon": "🟡",
    "desc": "完成下列各項：(1) 於考獲相應之專科徽章後，不少過三個月方可申請考驗；(2) 須以不少過三個月的時間，教導最少一名童軍考獲該專科徽章（曾於訓練班擔任教練工作可作參考）。考驗由團長安排，主考須為獲授權人士或其委任代表。",
    "descEn": "Instructor badge for this specialty: apply at least three months after earning the corresponding proficiency badge; coach at least one Scout to earn that badge over about three months. Assessment arranged by the Group Scout Leader; examiner is an authorised representative or appointee.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Instructor/InstructorGroupProficiencyBadges.pdf"
  },
  {
    "id": "SC-SEA-001",
    "badgeId": "SC-SEA-001",
    "name": "艇工",
    "en": "Oarsman",
    "group": "sea",
    "groupName": "海上活動",
    "groupNameEn": "Sea Activities",
    "icon": "⚓",
    "desc": "童軍支部海上活動徽章第一階段，相等於「一級童軍標準艇證書」課程內容（考獲一級童軍標準艇證書可一併獲簽發艇工章）。考驗由區專章秘書安排總會委任之童軍標準艇教練員負責；已持有本會認可證書可由獲授權人士直接簽發。訓練程序對應童軍探索獎章階段。",
    "descEn": "Sea Activity Badge stage 1, equivalent to the Level 1 Scout Standard Boat certificate (passing it also issues this badge). Assessed by Scout Standard Boat instructors appointed by the Association; aligned with the Pathfinder stage.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Sea/SeaActivityBadges.pdf"
  },
  {
    "id": "SC-SEA-002",
    "badgeId": "SC-SEA-002",
    "name": "水手",
    "en": "Boatman",
    "group": "sea",
    "groupName": "海上活動",
    "groupNameEn": "Sea Activities",
    "icon": "⚓",
    "desc": "童軍支部海上活動徽章第二階段，相等於「二級童軍標準艇證書」課程內容（考獲二級證書可一併獲簽發水手章）。考驗由區專章秘書安排總會委任之童軍標準艇教練員負責。訓練程序對應童軍標準獎章階段。",
    "descEn": "Sea Activity Badge stage 2, equivalent to the Level 2 Scout Standard Boat certificate. Assessed by appointed instructors; aligned with the Standard Award stage.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Sea/SeaActivityBadges.pdf"
  },
  {
    "id": "SC-SEA-003",
    "badgeId": "SC-SEA-003",
    "name": "水手長",
    "en": "Boatswain",
    "group": "sea",
    "groupName": "海上活動",
    "groupNameEn": "Sea Activities",
    "icon": "⚓",
    "desc": "童軍支部海上活動徽章第三階段，相等於「三級童軍標準艇證書」課程內容（考獲三級證書可一併獲簽發水手長章）。考驗由區專章秘書安排總會委任之童軍標準艇教練員負責。訓練程序對應童軍高級及總領袖獎章階段。",
    "descEn": "Sea Activity Badge stage 3, equivalent to the Level 3 Scout Standard Boat certificate. Assessed by appointed instructors; aligned with the Advanced/Chief Scout stages.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Sea/SeaActivityBadges.pdf"
  },
  {
    "id": "SC-AIR-001",
    "badgeId": "SC-AIR-001",
    "name": "初級航空活動",
    "en": "Basic Air Activity Badge",
    "group": "air",
    "groupName": "航空活動",
    "groupNameEn": "Air Activities",
    "icon": "✈️",
    "desc": "童軍支部航空活動課程第一階段，重點為小型飛機知識及基礎航空知識，配合模擬飛行體驗及自選航空活動；訓練程序對應童軍探索獎章階段。考驗由總會委任之主考負責，旅團可向總會青少年活動署或地域航空活動組申請考驗。",
    "descEn": "Air Activity Badge stage 1: light-aircraft and aviation knowledge with simulator and elective air activities; aligned with the Pathfinder stage. Assessed by examiners appointed by the Association.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Air/AirActivityBadges.pdf"
  },
  {
    "id": "SC-AIR-002",
    "badgeId": "SC-AIR-002",
    "name": "中級航空活動",
    "en": "Intermediate Air Activity Badge",
    "group": "air",
    "groupName": "航空活動",
    "groupNameEn": "Air Activities",
    "icon": "✈️",
    "desc": "童軍支部航空活動課程第二階段，深化航空知識及模擬飛行訓練；訓練程序對應童軍標準獎章階段（高級獎章 A6 要求考獲此章）。考驗由總會委任之主考負責。",
    "descEn": "Air Activity Badge stage 2: deeper aviation knowledge and simulator training; aligned with the Standard Award stage (required by Advanced A6). Assessed by appointed examiners.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Air/AirActivityBadges.pdf"
  },
  {
    "id": "SC-AIR-003",
    "badgeId": "SC-AIR-003",
    "name": "高級航空活動",
    "en": "Advanced Air Activity Badge",
    "group": "air",
    "groupName": "航空活動",
    "groupNameEn": "Air Activities",
    "icon": "✈️",
    "desc": "童軍支部航空活動課程第三階段，含進階航空知識、自選航空活動及航空安全要求；訓練程序對應童軍高級及總領袖獎章階段。考驗由總會委任之主考負責。",
    "descEn": "Air Activity Badge stage 3: advanced aviation knowledge, elective air activities and safety; aligned with the Advanced/Chief Scout stages. Assessed by appointed examiners.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Air/AirActivityBadges.pdf"
  },
  {
    "id": "SC-OTH-001",
    "badgeId": "SC-OTH-001",
    "name": "服務獎章",
    "en": "Service Flash",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "完成下列各項：考獲童軍標準獎章或以上進度性獎章；獲取兩個服務組專章（可以一個具服務性質的興趣組或技能組專章代替其中一個，並須參加該項經常性服務）；另考獲一個教導組專章或急救、消防、拯溺服務組專章之一（不計算入上一項）；參與一個為期三個月以上的服務（一般每星期一小時）。",
    "descEn": "Service Flash: hold the Standard Award or above; two Service Group badges (one may be a service-type Interest/Pursuit badge with ongoing service); one Instructor badge or First Aid/Fireman/Lifesaver; and three months of regular service (about one hour weekly).",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/ServiceFlash.pdf"
  },
  {
    "id": "SC-OTH-002",
    "badgeId": "SC-OTH-002",
    "name": "領導才獎章",
    "en": "Leadership Award",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "適合十三至十五歲童軍成員。完成下列各項：考獲探索獎章或以上；闡述小隊長會議功能、出席最少一次會議並執行一項議決案；完成認可個人事工計劃；組織一次小隊戶內或戶外集會；指導兩名童軍完成三個童軍技能項目或指導至少一名童軍考獲一個專科徽章；完成總會、地域或區舉辦的領導才訓練班；擔任小隊職務六個月以上或參與認可的領導才活動。",
    "descEn": "Leadership Award (ages 13-15): Pathfinder Award or above; patrol leaders' meeting knowledge and execution; a personal service project; organise a patrol meeting; coach others; a leadership training course; six months in a patrol appointment or equivalent activity.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/LeadershipAward.pdf"
  },
  {
    "id": "SC-OTH-003",
    "badgeId": "SC-OTH-003",
    "name": "小隊活動巾圈",
    "en": "Patrol Activity Woggle",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "適合十一至十五歲、已完成童軍標準獎章或以上之童軍成員佩戴，無需另行考驗。",
    "descEn": "Patrol Activity Woggle: wearable by Scouts aged 11-15 who completed the Standard Award or above; no separate assessment.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/PatrolActivityWoggle.pdf"
  },
  {
    "id": "SC-OTH-004",
    "badgeId": "SC-OTH-004",
    "name": "社區參與章",
    "en": "Community Involvement Badge",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "參與社區事務的獎章；2026年修訂版童軍高級獎章 D2「社區認識」選修例子中列出（與公民、多元共融等並列）。此章的個別考驗內容沒有在網上版刊載，請按總會最新公布辦理。",
    "descEn": "Community Involvement Badge: cited as a Community Awareness option (Advanced D2) in the 2026 scheme. The individual sheet is not published online; follow the latest Association notice.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/scout-training-scheme"
  },
  {
    "id": "SC-OTH-005",
    "badgeId": "SC-OTH-005",
    "name": "宗教章",
    "en": "Religious Badge",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "選擇其中一項宗教課程研習及考核（天主教、孔教、伊斯蘭教、佛教、基督教、道教），由團長、副團長、教練員教導或安排法師、牧師、神職人員、主日學導師等協助考核。各課程須解釋該教經典意義、列舉五卷經典（或背誦章句）、參與崇拜或儀式，並明白童軍誓詞「對神明．盡責任」在該教的意義。",
    "descEn": "Religious Badge: study one of six courses (Catholic, Confucian, Islam, Buddhism, Christianity, Taoism) with a suitable assessor; explain scriptures, join worship/ceremonies, and relate the Promise to the faith.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/ReligiousBadge.pdf"
  },
  {
    "id": "SC-OTH-006",
    "badgeId": "SC-OTH-006",
    "name": "維護自然世界章",
    "en": "World Conservation Badge",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "國際性環境獎章，保留既有紀錄之用；不在2026年修訂版《童軍訓練綱要》「其他獎章及徽章」最新列表內。如要考取現行環保獎章，請參閱地球部落系列（走塑達人、自然守護者、日光善用者）或「積極公民」系列環保先鋒章，並按總會及 WOSM 現行要求核實。",
    "descEn": "Legacy international conservation badge, kept for existing records; not on the current 2026 Other Awards list. For current environmental awards see the Earth Tribe challenges or the Green Pioneer Badge.",
    "assessedBy": "member",
    "sourceUrl": "https://www.scout.org.hk/"
  },
  {
    "id": "SC-OTH-007",
    "badgeId": "SC-OTH-007",
    "name": "世界童軍環境章",
    "en": "World Scout Environment Badge",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "WOSM 世界童軍環境章，保留既有紀錄之用；不在2026年修訂版《童軍訓練綱要》「其他獎章及徽章」最新列表內。WOSM 已以「地球部落」取代世界童軍環境計劃，但並無官方逐項兌換；如要考取地球部落獎章須另行完成相關挑戰。",
    "descEn": "World Scout Environment Badge (WOSM), kept for existing records; not on the current 2026 Other Awards list. WOSM replaced its environment programme with Earth Tribe without a one-to-one conversion.",
    "assessedBy": "member",
    "sourceUrl": "https://www.scout.org.hk/"
  },
  {
    "id": "SC-OTH-008",
    "badgeId": "SC-OTH-008",
    "name": "深資童軍先修章",
    "en": "Venture Scout Link Badge",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "年滿十四歲半之童軍成員可考取，完成後由童軍團長簽發。完成下列各項：說出深資童軍支部目的、方法及預期成果；認識制服；明瞭深資童軍獎章及榮譽童軍獎章的四個考驗組別、範圍及與其他機構的關連；說出執行委員會的基本功能、組織、委員職責、產生方法及領袖角色；認識多元化深資童軍活動；並參加最少一次深資童軍執行委員會會議。",
    "descEn": "Venture Scout Link Badge (age 14½+): know the Venture Section's aims, uniform, award structure and joint awards; the functions and structure of the Venture Executive Committee; join at least one VEC meeting. Signed off by the Scout Leader.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/VentureScoutLinkBadge.pdf"
  },
  {
    "id": "SC-OTH-009",
    "badgeId": "SC-OTH-009",
    "name": "香港青年獎勵計劃",
    "en": "The Hong Kong Award for Young People",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🏅",
    "desc": "國際青年獎勵計劃（前身愛丁堡公爵獎勵計劃），設銅、銀、金三級，各含服務、野外鍛鍊、技能、康樂體育四科（金章加團體生活科）。14至16歲前童軍可由銅章級或直接銀章級開始（建議由銅章級）；須先出席迎新講座及開設紀錄簿。各科設時數及月數要求（如銅章主項26小時／6個月、野外鍛鍊兩日一夜12小時）。童軍支部訓練內容可同時作有關科目評核，但須符合計劃特定要求。詳見 ayp.org.hk。",
    "descEn": "The Hong Kong Award for Young People (formerly Duke of Edinburgh): Bronze/Silver/Gold with Service, Expeditions, Skills, Physical Recreation (plus Residential at Gold). Scouts aged 14-16 may start at Bronze or direct Silver after an induction and opening a record book; section hours apply. See ayp.org.hk.",
    "assessedBy": "member",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/TheHongKongAwardForYoungPeople.pdf"
  },
  {
    "id": "SC-OTH-010",
    "badgeId": "SC-OTH-010",
    "name": "和平使者章",
    "en": "Messengers of Peace",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🌍",
    "desc": "世界童軍「和平使者計劃」（Messengers of Peace）徽章。參加已於世界童軍組織可持續發展目標網站登記並獲本會核准的和平使者計劃活動即可獲發購章券；活動須切合計劃主題，並含服務元素（每名參加者最少一小時服務）。青少年成員獲取後可佩戴至晉升支部前，晉升後須重新參與活動再獲佩戴資格（見國際通告 05/2023）。",
    "descEn": "Messengers of Peace (WOSM) badge. Earned by joining an MoP activity registered on the WOSM SDG site and approved by the Association, including at least one hour of service per participant. Wearable until moving to the next Section; see International Circular 05/2023.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/MessengersOfPeace.pdf"
  },
  {
    "id": "SC-OTH-011",
    "badgeId": "SC-OTH-011",
    "name": "走塑達人章",
    "en": "Plastic Tide Turners",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "♻️",
    "desc": "世界童軍「地球部落」（Earth Tribe）走塑達人挑戰徽章。完成三個走塑達人挑戰學習活動（污染對生態的影響、環保戶外做法、可持續生活等）；與小隊計劃及完成一個相關事工或服務計劃；完成後與其他成員分享心得。獲取後即為地球部落一員。",
    "descEn": "Earth Tribe Plastic Tide Turners badge: complete three learning activities, a patrol service/project on pollution and sustainability, and share reflections. Earns Earth Tribe membership.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/PlasticTideTurnersBadge.pdf"
  },
  {
    "id": "SC-OTH-012",
    "badgeId": "SC-OTH-012",
    "name": "自然守護者章",
    "en": "Champions for Nature",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🌿",
    "desc": "世界童軍「地球部落」自然守護者挑戰徽章。完成三個自然守護者挑戰學習活動（自然法則、生物多樣性、食物來源與環境責任等）；與小隊計劃及完成相關事工或服務計劃；完成後分享心得。獲取後即為地球部落一員。",
    "descEn": "Earth Tribe Champions for Nature badge: three learning activities (natural laws, biodiversity, food and responsibility), a patrol project/service, and shared reflections. Earns Earth Tribe membership.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/ChampionsForNatureBadge.pdf"
  },
  {
    "id": "SC-OTH-013",
    "badgeId": "SC-OTH-013",
    "name": "日光善用者章",
    "en": "Scouts Go Solar",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "☀️",
    "desc": "世界童軍「地球部落」日光善用者挑戰徽章。完成三個學習活動（氣候變化成因、能源對環境的影響、減少能源消耗）；與小隊計劃及完成相關事工或服務計劃；完成後分享心得。獲取後即為地球部落一員。",
    "descEn": "Earth Tribe Scouts Go Solar badge: three learning activities (climate change, energy impacts, reducing consumption), a patrol project/service, and shared reflections. Earns Earth Tribe membership.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/ScoutsGoSolarBadge.pdf"
  },
  {
    "id": "SC-OTH-014",
    "badgeId": "SC-OTH-014",
    "name": "環保先鋒章",
    "en": "Green Pioneer",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🛡️",
    "desc": "「積極公民」獎章系列之一。認識香港環保政策及措施、本地及全球環境議題、人與環境關係及保護環境方法。須完成環境運動委員會委任導師教授的環保內容、一項環委會安排的環境教育培訓活動，以及一項由本會或其他機構舉辦的環境教育培訓活動。",
    "descEn": "Active Citizenship series — Green Pioneer Badge: taught by an appointed Green Pioneer Instructor, plus one Environmental Campaign Committee training activity and one environmental education activity organised by the Association or another body.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/GreenPioneerBadge.pdf"
  },
  {
    "id": "SC-OTH-015",
    "badgeId": "SC-OTH-015",
    "name": "防騙先鋒章",
    "en": "Anti-Deception",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🛡️",
    "desc": "「積極公民」獎章系列之一。認識各類騙案（網購、電郵、電話、網戀、求職及刷單騙案）的方式及預防；認識保護個人資料及健康網絡習慣（網絡釣魚、資料外洩成因影響及防範措施）；認識求助方法（重設密碼、舉報、向私隱專員公署投訴等）；並向小隊分享最近三個月最少三份相關新聞，附個人評論及可行建議。",
    "descEn": "Active Citizenship series — Anti-Deception Badge: recognise common scams and prevention, personal data protection and healthy online habits, help channels after data leaks, and share at least three recent news items with comments and suggestions.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/AntiDeceptionBadge.pdf"
  },
  {
    "id": "SC-OTH-016",
    "badgeId": "SC-OTH-016",
    "name": "保護兒童章",
    "en": "Child Protection",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🛡️",
    "desc": "「積極公民」獎章系列之一。認識四種常見兒童侵害情況（網絡侵害或罪案、身體傷害、性罪行、詐騙）；學習自身或身邊的人遇到事件時的處理步驟（保持冷靜、尋找安全地點、聯絡可信任成人、報警、提供資訊、情緒支持）；觀看最少三條媒體採訪作個案分析（性罪行、身體虐待、網絡罪案、刑事毀壞），並向小隊分享個人看法、處理方法及建議。",
    "descEn": "Active Citizenship series — Child Protection Badge: recognise four common child-abuse scenarios, learn the response steps, analyse at least three media cases and share views and suggestions with the patrol.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/ChildProtectionBadge.pdf"
  },
  {
    "id": "SC-OTH-017",
    "badgeId": "SC-OTH-017",
    "name": "禁毒章",
    "en": "Anti-Drug",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🛡️",
    "desc": "「積極公民」獎章系列之一。認識常見毒品（依托咪酯、氯胺酮、大麻、冰毒、可卡因、海洛英）及其禍害；了解毒品相關刑罰、吸毒場所與原因、應對及求助方法；認識被招攬販毒的常見原因及支援康復機構。",
    "descEn": "Active Citizenship series — Anti-Drug Badge: know common drugs and harms, drug offences, venues and causes of abuse, coping/help channels, and recruitment-to-trafficking risks plus rehabilitation services.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/AntiDrugBadge.pdf"
  },
  {
    "id": "SC-OTH-018",
    "badgeId": "SC-OTH-018",
    "name": "社區應急先鋒章",
    "en": "Community Emergency Responder",
    "group": "other",
    "groupName": "其他",
    "groupNameEn": "Other",
    "icon": "🛡️",
    "desc": "「積極公民」獎章系列之一。完成一小時網上課程（火警逃生、消防安全及家居防火、基本消防安全裝置），並向小隊分享最近三個月最少三份相關新聞附個人評論及建議；並完成總會／地域／區舉辦的社區應急先鋒訓練班，或持有「社區應急先鋒」計劃證書。",
    "descEn": "Active Citizenship series — Community Emergency Responder Badge: a one-hour online fire-safety course with three recent news items shared, plus the CER training course or a valid CER programme certificate.",
    "assessedBy": "",
    "sourceUrl": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/pdf-zh/Others/CommunityEmergencyResponderBadge.pdf"
  }
];

/** 訓練計劃（上游原文，用於訓練計劃頁） */
export const TRAINING_PLAN = {
  "title": "童軍支部的訓練計劃（2026年修訂版《童軍訓練綱要》，2026年8月15日起實施）",
  "purpose": "童軍支部（11-16歲）以「擁抱挑戰・建立團隊」為定位，透過進度性獎章及專科徽章制度，配合小隊制度，從實踐中學習，促進身心精神陶冶",
  "method": [
    "小隊制度：小隊為基本單位，由隊長帶領",
    "進度性獎章：探索→標準→高級→總領袖，循序漸進（另有會員章）",
    "專科徽章：興趣組（旅團考）、技能組及服務組（須團長批准，獲授權代表考驗）、教導組（取得相關專科徽章三個月後，指導不少於一名童軍約三個月）",
    "過渡安排：2026年8月15日前宣誓的成員可選新制或於2028年8月14日前完成舊制（P022/2026），詳見「過渡對照」面板"
  ],
  "expected": [
    "德智體群美靈六育發展",
    "小隊合作及領導",
    "戶外技能及服務"
  ],
  "progressFlow": "會員章→童軍探索獎章→童軍標準獎章→童軍高級獎章→總領袖獎章（各獎章由進度項目組成；選修項目按綱要指定數目選取）",
  "assessmentPrinciples": "興趣組專科徽章由童軍團長安排主考（主考人為總會、地域或區會獲授權代表、或團長委任的合適人士）；技能組、服務組及教導組須經童軍團長批准考驗申請，再由獲授權代表考驗。無論新舊制度，申請各級獎章必須使用指定表格。",
  "links": [
    {
      "title": "童軍訓練綱要（2026年修訂版，逐章下載）",
      "url": "https://scoutsinfohub.org.hk/scout-training-scheme"
    },
    {
      "title": "新修訂支部訓練綱要過渡期安排（總會通告 P022/2026）",
      "url": "https://www.scout.org.hk/uploads/tc/circulars/23585/p022-26.pdf"
    },
    {
      "title": "童軍訓練綱要（2017年第1次修訂版全本，過渡期沿用）",
      "url": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/FullVersion-zh.pdf"
    },
    {
      "title": "童軍資訊站",
      "url": "https://scoutsinfohub.org.hk/"
    },
    {
      "title": "童軍總會通告 P013/26（指定表格）",
      "url": "https://www.scout.org.hk/uploads/tc/circulars/23262/p013-26.pdf"
    }
  ]
};
export const TRAINING_PLAN_EN = {
  "title": "Scout Section Training Programme (2017 1st Revision + 2026 Proficiency Badge Update)",
  "purpose": "The Scout Section (ages 11–16) promotes physical, mental and spiritual development. Through the progressive awards and the proficiency badge scheme, together with the Patrol System, members learn by doing.",
  "method": [
    "Patrol System: the patrol is the basic unit, led by the Patrol Leader",
    "Progressive Awards: Pathfinder → Standard → Advanced → Chief Scout's, step by step",
    "Proficiency Badges: Interest (green, troop-assessed, leader ticks), Pursuit (blue, district-assessed, member fills date and leader approves), Service (red, district-assessed), Instructor (yellow, teach others 3 months after attaining)"
  ],
  "expected": [
    "Development across the six domains (moral, intellectual, physical, social, aesthetic and spiritual)",
    "Patrol co-operation and leadership",
    "Outdoor skills and service"
  ],
  "progressFlow": "Membership Badge → Scout Pathfinder Award → Scout Standard Award → Scout Advanced Award → Chief Scout's Award (each award consists of progress items; no stage badges)",
  "assessmentPrinciples": "Interest badges may be assessed under the arrangement of the Scout Leader. Pursuit, Service and Instructor badges require the Scout Leader's approval of the assessment application, and assessment by an authorised representative of the Association, a Region or a District. First Aid, Fireman and Lifesaver all belong to the Service Group.",
  "links": [
    {
      "title": "Scout Training Scheme (Full English Version)",
      "url": "https://scoutsinfohub.org.hk/ScoutTrainingScheme/FullVersion-en.pdf"
    },
    {
      "title": "Scouts Information Hub",
      "url": "https://scoutsinfohub.org.hk/"
    },
    {
      "title": "SAHK Circular P013/26 (Chinese)",
      "url": "https://www.scout.org.hk/uploads/tc/circulars/23262/p013-26.pdf"
    }
  ]
};

/** 保護童軍成員免受傷害（上游原文，用於安全頁） */
export const SAFE_FROM_HARM = {
  "title": "保護童軍成員免受傷害 Safe from Harm",
  "policy": "所有童軍活動須在安全環境進行",
  "learning": [
    {
      "title": "保護童軍成員免受傷害 網上自學課程",
      "url": "https://sfh.scout.org.hk",
      "mandatory": true
    }
  ],
  "prevention": [
    "兩人同行",
    "保持界限"
  ],
  "handling": [
    "聆聽",
    "記錄",
    "報告"
  ],
  "hotlines": [
    {
      "name": "童軍總會",
      "tel": "2957 6414"
    }
  ]
};
export const SAFE_FROM_HARM_EN = {
  "title": "Safe from Harm — Protecting Scouts from Harm",
  "policy": "All Scout activities must be conducted in a safe environment.",
  "learning": [
    {
      "title": "Safe from Harm online self-learning course",
      "url": "https://sfh.scout.org.hk",
      "mandatory": true
    }
  ],
  "prevention": [
    "Two-person rule",
    "Maintain appropriate boundaries"
  ],
  "handling": [
    "Listen",
    "Record",
    "Report"
  ],
  "hotlines": [
    {
      "name": "Scout Association of Hong Kong",
      "tel": "2957 6414"
    }
  ]
};

export const ALL_AWARDS = [...BADGE_SYLLABUS];

/** 所有細項（L1–L5） */
export const SYLLABUS_ITEMS = ALL_AWARDS.flatMap((badge) =>
  badge.segments.flatMap((segment) =>
    segment.items.map((item) => ({ ...item, badgeIdGroup: badge.id, segmentCode: segment.code })),
  ),
);

export const ITEM_INDEX = Object.fromEntries(SYLLABUS_ITEMS.map((item) => [item.id, item]));

/** BOOK 鍵 → scoutbadge 官方編號（兩者相同，保留映射以兼容同步契約） */
export const BOOK_TO_BADGE_ID = Object.fromEntries([
  ...SYLLABUS_ITEMS.map((item) => [item.id, item.badgeId]),
  ...OTHER_BADGES.map((badge) => [badge.id, badge.badgeId]),
]);

/** scoutbadge 官方編號 → BOOK 鍵 */
export const BADGE_ID_TO_BOOK = (() => {
  const out = {};
  for (const [bookId, badgeId] of Object.entries(BOOK_TO_BADGE_ID)) {
    out[badgeId] = bookId;
    out[bookId] = bookId;
  }
  return out;
})();

const norm = (value) => String(value ?? '').trim();

/** 任何來源的項目編號 → BOOK 內部鍵（未知編號原樣回傳，不靜默改寫）。 */
export function toBookId(id) {
  const key = norm(id);
  if (!key) return '';
  return BADGE_ID_TO_BOOK[key] || key;
}

/** BOOK 內部鍵 → scoutbadge 官方編號。 */
export function toBadgeId(id) {
  const key = norm(id);
  if (!key) return '';
  return BOOK_TO_BADGE_ID[key] || key;
}

/** 該項目是否屬於本紀錄冊的現行綱要（用於同步時丟棄未知／他人資料）。 */
export function isKnownItem(id) {
  const key = norm(id);
  return Boolean(key) && (Boolean(ITEM_INDEX[key]) || OTHER_BADGES.some((b) => b.id === key));
}

/** 給定 BOOK 鍵，找回獎章群組（L1–L5 / 專科徽章）。 */
export function awardOfItem(id) {
  const key = norm(id);
  const badge = ALL_AWARDS.find((b) => b.segments.some((s) => s.items.some((i) => i.id === key)));
  if (badge) return badge;
  return OTHER_BADGES.find((b) => b.id === key) || null;
}
