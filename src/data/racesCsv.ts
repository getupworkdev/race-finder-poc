// Sample data only. These races are fictional and exist to demonstrate the CSV import path.
export const RACES_CSV = `id,title,discipline,distance_km,date,city,state,lat,lng,elevation_m,is_pb_course,is_scenic,ticket_status,registration_url
r001,Sample Sydney Ultra 50K,Trail,50,2027-11-02,Sydney,NSW,-33.9218,151.2102,650,0,1,Open,https://example.com/register/r001
r002,Sample Sydney 10K,Run,10,2027-02-14,Sydney,NSW,-33.9217,151.2172,140,0,0,Open,https://example.com/register/r002
r003,Sample Sydney 5K Dash,Run,5,2027-11-21,Sydney,NSW,-33.8258,151.1841,20,1,1,Open,https://example.com/register/r003
r004,Sample Newcastle Gran Fondo 120K,Cycling,120,2027-10-10,Newcastle,NSW,-32.9116,151.7664,2200,0,1,Early Bird,https://example.com/register/r004
r005,Sample Newcastle Half Marathon,Run,21.0975,2027-12-03,Newcastle,NSW,-32.895,151.7776,20,1,0,Ballot Open,https://example.com/register/r005
r006,Sample Wollongong Ultra 50K,Trail,50,2027-04-26,Wollongong,NSW,-34.4518,150.8925,900,0,1,Open,https://example.com/register/r006
r007,Sample Wollongong Trail 25K,Trail,25,2027-12-15,Wollongong,NSW,-34.4376,150.924,650,0,1,Open,https://example.com/register/r007
r008,Sample Byron Bay 70.3 Triathlon,Triathlon,113,2027-01-22,Byron Bay,NSW,-28.6478,153.6376,300,0,0,Open,https://example.com/register/r008
r009,Sample Byron Bay Olympic Triathlon,Triathlon,51.5,2027-02-09,Byron Bay,NSW,-28.6297,153.6612,120,0,0,Ballot Open,https://example.com/register/r009
r010,Sample Canberra Trail 25K,Trail,25,2027-11-12,Canberra,ACT,-35.2676,149.1292,2100,0,1,Open,https://example.com/register/r010
r011,Sample Canberra Olympic Triathlon,Triathlon,51.5,2027-05-05,Canberra,ACT,-35.287,149.1359,300,0,1,Open,https://example.com/register/r011
r012,Sample Melbourne Olympic Triathlon,Triathlon,51.5,2027-07-12,Melbourne,VIC,-37.8458,144.9311,120,0,1,Ballot Open,https://example.com/register/r012
r013,Sample Melbourne Trail 25K,Trail,25,2027-10-06,Melbourne,VIC,-37.8233,144.9474,1400,0,1,Early Bird,https://example.com/register/r013
r014,Sample Melbourne Ultra 50K,Trail,50,2027-06-05,Melbourne,VIC,-37.8265,144.951,2100,0,1,Open,https://example.com/register/r014
r015,Sample Geelong 70.3 Triathlon,Triathlon,113,2027-01-07,Geelong,VIC,-38.1378,144.314,300,0,1,Early Bird,https://example.com/register/r015
r016,Sample Geelong Olympic Triathlon,Triathlon,51.5,2027-03-18,Geelong,VIC,-38.1849,144.3468,520,0,1,Sold Out,https://example.com/register/r016
r017,Sample Ballarat Trail 25K,Trail,25,2027-10-12,Ballarat,VIC,-37.503,143.8462,650,0,1,Ballot Open,https://example.com/register/r017
r018,Sample Ballarat Ultra 50K,Trail,50,2027-05-03,Ballarat,VIC,-37.5334,143.8477,650,0,1,Sold Out,https://example.com/register/r018
r019,Sample Bright 10K,Run,10,2027-04-17,Bright,VIC,-36.698,146.9358,80,0,0,Sold Out,https://example.com/register/r019
r020,Sample Bright Marathon,Run,42.195,2027-02-23,Bright,VIC,-36.7251,146.9935,80,0,0,Open,https://example.com/register/r020
r021,Sample Brisbane 5K Dash,Run,5,2027-04-27,Brisbane,QLD,-27.4421,153.0839,140,0,0,Open,https://example.com/register/r021
r022,Sample Brisbane Gran Fondo 120K,Cycling,120,2027-08-09,Brisbane,QLD,-27.4112,153.0797,2200,0,1,Open,https://example.com/register/r022
r023,Sample Brisbane Olympic Triathlon,Triathlon,51.5,2027-02-08,Brisbane,QLD,-27.4719,153.0833,300,0,0,Early Bird,https://example.com/register/r023
r024,Sample Gold Coast Marathon,Run,42.195,2027-11-12,Gold Coast,QLD,-28.0193,153.3614,20,1,0,Sold Out,https://example.com/register/r024
r025,Sample Gold Coast 70.3 Triathlon,Triathlon,113,2027-06-03,Gold Coast,QLD,-27.9897,153.3604,300,0,0,Open,https://example.com/register/r025
r026,Sample Sunshine Coast Marathon,Run,42.195,2027-10-15,Sunshine Coast,QLD,-26.6442,153.0093,45,1,1,Sold Out,https://example.com/register/r026
r027,Sample Sunshine Coast 10K,Run,10,2027-11-04,Sunshine Coast,QLD,-26.6845,153.0668,45,1,1,Early Bird,https://example.com/register/r027
r028,Sample Cairns Ultra 50K,Trail,50,2027-09-14,Cairns,QLD,-16.8709,145.7976,650,0,1,Early Bird,https://example.com/register/r028
r029,Sample Cairns Trail 25K,Trail,25,2027-07-27,Cairns,QLD,-16.9764,145.7709,900,0,1,Open,https://example.com/register/r029
r030,Sample Townsville Marathon,Run,42.195,2027-03-05,Townsville,QLD,-19.2568,146.8236,140,0,0,Open,https://example.com/register/r030
r031,Sample Townsville 10K,Run,10,2027-09-02,Townsville,QLD,-19.2581,146.8243,45,1,0,Open,https://example.com/register/r031
r032,Sample Adelaide 70.3 Triathlon,Triathlon,113,2027-09-20,Adelaide,SA,-34.9311,138.6537,300,0,0,Sold Out,https://example.com/register/r032
r033,Sample Adelaide Ultra 50K,Trail,50,2027-09-09,Adelaide,SA,-34.9739,138.5938,2100,0,1,Open,https://example.com/register/r033
r034,Sample Adelaide Trail 25K,Trail,25,2027-11-08,Adelaide,SA,-34.9522,138.5554,650,0,1,Open,https://example.com/register/r034
r035,Sample Victor Harbor Ultra 50K,Trail,50,2027-05-05,Victor Harbor,SA,-35.5642,138.6155,900,0,1,Sold Out,https://example.com/register/r035
r036,Sample Victor Harbor 10K,Run,10,2027-04-06,Victor Harbor,SA,-35.5738,138.6437,140,0,1,Open,https://example.com/register/r036
r037,Sample Barossa Valley Ultra 50K,Trail,50,2027-08-23,Barossa Valley,SA,-34.5181,138.9515,2100,0,1,Open,https://example.com/register/r037
r038,Sample Barossa Valley 70.3 Triathlon,Triathlon,113,2027-02-26,Barossa Valley,SA,-34.4843,138.9118,120,0,1,Open,https://example.com/register/r038
r039,Sample Perth Olympic Triathlon,Triathlon,51.5,2027-03-18,Perth,WA,-31.9297,115.8523,120,0,1,Open,https://example.com/register/r039
r040,Sample Perth Trail 25K,Trail,25,2027-05-01,Perth,WA,-31.9096,115.8093,1400,0,1,Open,https://example.com/register/r040
r041,Sample Perth 5K Dash,Run,5,2027-08-01,Perth,WA,-31.9491,115.8299,80,0,1,Open,https://example.com/register/r041
r042,Sample Busselton 10K,Run,10,2027-01-06,Busselton,WA,-33.6878,115.3385,45,1,0,Sold Out,https://example.com/register/r042
r043,Sample Busselton Trail 25K,Trail,25,2027-03-09,Busselton,WA,-33.7107,115.373,650,0,1,Early Bird,https://example.com/register/r043
r044,Sample Margaret River 5K Dash,Run,5,2027-04-15,Margaret River,WA,-33.9084,115.1314,20,1,0,Open,https://example.com/register/r044
r045,Sample Margaret River 70.3 Triathlon,Triathlon,113,2027-12-07,Margaret River,WA,-33.9982,115.1337,120,0,0,Open,https://example.com/register/r045
r046,Sample Hobart 10K,Run,10,2027-02-21,Hobart,TAS,-42.8411,147.3717,80,0,1,Sold Out,https://example.com/register/r046
r047,Sample Hobart Marathon,Run,42.195,2027-05-20,Hobart,TAS,-42.9098,147.2676,45,1,1,Open,https://example.com/register/r047
r048,Sample Launceston Ultra 50K,Trail,50,2027-04-02,Launceston,TAS,-41.4931,147.1299,900,0,1,Ballot Open,https://example.com/register/r048
r049,Sample Launceston Gran Fondo 120K,Cycling,120,2027-05-17,Launceston,TAS,-41.4823,147.1821,900,0,1,Open,https://example.com/register/r049
r050,Sample Darwin Olympic Triathlon,Triathlon,51.5,2027-07-01,Darwin,NT,-12.4085,130.888,520,0,1,Open,https://example.com/register/r050
r051,Sample Darwin Marathon,Run,42.195,2027-11-23,Darwin,NT,-12.4365,130.8628,140,0,1,Open,https://example.com/register/r051
r052,Sample Alice Springs Gran Fondo 120K,Cycling,120,2027-12-23,Alice Springs,NT,-23.6622,133.906,2200,0,1,Sold Out,https://example.com/register/r052
r053,Sample Alice Springs Olympic Triathlon,Triathlon,51.5,2027-11-08,Alice Springs,NT,-23.6429,133.8659,120,0,0,Ballot Open,https://example.com/register/r053`;
