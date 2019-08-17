/* Author(s): Chiam Jack How */
var seeder = require('mongoose-seed')

// Connect to MongoDB via Mongoose

mogodb = "mongodb://localhost/dbtest"

seeder.connect(mogodb, {
    useNewUrlParser: true
}, function () {

    // Load Mongoose models
    seeder.loadModels([
        './models/incident_details.js',
        './models/incident_reporter.js',
        './models/incidents.js',
        './models/resources.js',
        './models/user.js'
    ])

    // Clear specified collections
    seeder.clearModels(['incident_details', 'incident_reporter', 'incidents', 'resources', 'user'], function () {

        // Callback to populate DB once collections have been cleared
        seeder.populateModels(data, function () {
         
        })

    })
})

// Data array containing seed data - documents organized by Model
var data = [{
        'model': 'incidents',
        'documents': [

            {
                _id: "5bda598006b20e02dd8ebe41",
                incident_location: "Choa Chu Kang, Singapore",
                incident_lat: 1.3839803,
                incident_lng: 103.7469611,
                incident_name: "Dengue",
                incident_description: "Fire",
                incident_details: "5bda598006b20e02dd8ebe40",
                incident_reporter: "5bda597f06b20e02dd8ebe3f"
            },
            {
                _id: "5be05c4c25e0070e22b35638",
                incident_location: "Asia Square Tower 2, Singapore",
                incident_lat: 1.2781459,
                incident_lng: 103.8511983,
                incident_name: "Dengue",
                incident_description: "A",
                incident_details: "5be05c4c25e0070e22b35637",
                incident_reporter: "5be05c4c25e0070e22b35636"
            },
            {
                _id: "5be030f55790eb591c5c9f90",
                incident_location: "Pipit Road, Singapore",
                incident_lat: 1.3238142,
                incident_lng: 103.8861799,
                incident_name: "Haze",
                incident_description: "Heavy Haze, very smokey",
                incident_details: "5be030f55790eb591c5c9f8f",
                incident_reporter: "5bda597f06b20e02dd8ebe3f"
            },
            {
                _id: "5be08fe53a639734e30ccea8",
                incident_location: "Choa Chu Kang Avenue 4, Lot One Shoppers' Mall, Singapore",
                incident_lat: 1.3851131,
                incident_lng: 103.744937,
                incident_name: "Fire",
                incident_description: "Fire in mall",
                incident_details: "5be08fe53a639734e30ccea7",
                incident_reporter: "5be08fe53a639734e30ccea6"
            },
            {
                _id: "5be025e25790eb591c5c9f24",
                incident_location: "Robinson Road, WeWork 71 Robinson, Singapore",
                incident_lat: 1.2785389,
                incident_lng: 103.8488535,
                incident_name: "Dengue",
                incident_description: "3 new dengue cases, dispatch NEA to examine",
                incident_details: "5be025e25790eb591c5c9f23",
                incident_reporter: "5be025e25790eb591c5c9f22"
            },
            {
                _id: "5be026605790eb591c5c9f2d",
                incident_location: "Tampines Street 22, 280 Indian Muslim Food, Singapore",
                incident_lat: 1.3478031,
                incident_lng: 103.9516125,
                incident_name: "Dengue",
                incident_description: "ad",
                incident_details: "5be06b29f7ef0d1bd9e43d97",
                incident_reporter: "5be06b29f7ef0d1bd9e43d96"
            },
            {
                _id: "5be026a45790eb591c5c9f30",
                incident_location: "Jurong Town Hall Road, Snow City, Singapore",
                incident_lat: 1.3351431,
                incident_lng: 103.7351617,
                incident_name: "Dengue",
                incident_description: "Alot ad",
                incident_details: "5be026f25790eb591c5c9f35",
                incident_reporter: "5be026f25790eb591c5c9f34"
            },
            {
                _id: "5be026b65790eb591c5c9f33",
                incident_location: "Singapore",
                incident_lat: 1.352083,
                incident_lng: 103.819836,
                incident_name: "Fire",
                incident_description: "F",
                incident_details: "5be026b65790eb591c5c9f32",
                incident_reporter: "5be026b65790eb591c5c9f31"
            }

        ]
    },
    {
        'model': 'incident_details',
        'documents': [

            {
                _id: "5bda598006b20e02dd8ebe40",
                incident_status: "ONGOING",
                crisis_level: 3,
                incident_activities: "None",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            },
            {
                _id: "5be05c4c25e0070e22b35637",
                incident_status: "ONGOING",
                crisis_level: 2,
                incident_activities: "None",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            },
            {
                _id: "5be030f55790eb591c5c9f8f",
                incident_status: "ONGOING",
                crisis_level: 1,
                incident_activities: "None",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            },
            {
                _id: "5be08fe53a639734e30ccea7",
                incident_status: "ONGOING",
                crisis_level: 0,
                incident_activities: "None",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            },
            {
                _id: "5be025e25790eb591c5c9f23",
                incident_status: "ONGOING",
                crisis_level: 0,
                incident_activities: "NEA",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            },
            {
                _id: "5be06b29f7ef0d1bd9e43d97",
                incident_status: "RESOLVED",
                crisis_level: 1,
                incident_activities: "None",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            },
            {
                _id: "5be026f25790eb591c5c9f35",
                incident_status: "RESOLVED",
                crisis_level: 2,
                incident_activities: "None",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            },
            {
                _id: "5be026b65790eb591c5c9f32",
                incident_status: "RESOLVED",
                crisis_level: 3,
                incident_activities: "Police,NEA",
                date_created: "2018-11-01T01:40:16.007Z",
                date_resolved: "2018-11-01T01:40:16.007Z"
            }
        ]
    },
    {
        'model': 'incident_reporter',
        'documents': [

            {
                _id: "5bda597f06b20e02dd8ebe3f",
                reporter_name: "jack",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            },
            {
                _id: "5be05c4c25e0070e22b35636",
                reporter_name: "Ben",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            },
            {
                _id: "5be030f55790eb591c5c9f8e",
                reporter_name: "John",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            },
            {
                _id: "5be08fe53a639734e30ccea6",
                reporter_name: "staff",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            },
            {
                _id: "5be025e25790eb591c5c9f22",
                reporter_name: "Bob",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            },
            {
                _id: "5be06b29f7ef0d1bd9e43d96",
                reporter_name: "admin",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            },
            {
                _id: "5be026f25790eb591c5c9f34",
                reporter_name: "Trun",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            },
            {
                _id: "5be026b65790eb591c5c9f31",
                reporter_name: "Truno",
                reporter_email: "place@holder",
                reporter_contact_number: "123456789"
            }
        ]
    },
    {
        'model': 'resources',
        'documents': [

            {
                _id: "5bd8d989c4f70235f60ef137",
                resource_name: "NEA",
                resource_email: "NEA@gov.sg",
                resource_tel: "123456789",
                resource_sms: "123456789",
                resource_purpose: "Cleaniless"
            },
            {
                _id: "5bd8d989c4f70675f60ef1e7",
                resource_name: "Police",
                resource_email: "police@gov.sg",
                resource_tel: "123456789",
                resource_sms: "123456789",
                resource_purpose: "Security"
            },
            {
                _id: "5bd8d9c7c4f70675f60ef13e",
                resource_name: "SAF",
                resource_email: "SAF@gov.sg",
                resource_tel: "123456789",
                resource_sms: "123456789",
                resource_purpose: "Army"
            }

        ]
    },
    {
        'model': 'user',
        'documents': [

            {
                username: "jack",
                salt: "9ac926259b2c25ea25be7c8e2c326b8ae61c1032130f4c09e7bbb696a5618060",
                hash: "5fe41c3ac91095f6c55570ea731fa2faba4405898f04a0fb03c91b048172602294101f35bba93702b65888266cbdcd7750f617c2c04920918f780f5f967111431055fc6488dd28a8d6ba4d3819c11e530404f52305e3f8f96f0595843af806d6a04d82c18ebcb3f8fe3eab1653b6e6150945605bc8d4003666a445e8e95fcab407931d1e46e1f6a01b65fcad6436fca5402b8f14a61968b87c41bf16a00e865ec6e8691750b462ddc545fe4d52b606e2cb04dd6af4f6c421682e97c92e567147c0760a552889db18b4ba7c325f135a6e8e9316e4019f80bb6541ae2dd59daf023adcf8b167f828e3baa5ec1f53869ca7ebd164a09580d2a39f11c6a29ca6024617e0f927a8142fc5968cf5804b619a7aced89fb430c7e89fd7bcc47234cd9efcde6856e7d082cb65bad5afae403b5a860327098353cd5aa939f6842edec86d3ba087e6501ef4b05a1e229ebafa37e02c2bc0149a7b84b0938a3eeda96b5a46cc97acf49300a376dfe32fccc5d93b08ec63d5c05a7a4cb6ee917eb36887b586456b0df00c85a89b068888a8cbeb2f9edd582bcd4d3f47ae97e42da06b4ead4013a6b4800f6003b3caa90f8cb070c753fc927c0e1a5d26fb57ebea787048fa9ba0f47e3b667e06290cfc188a5da78cd366347fc428385da5d636adc035e40391b07575bc206ba938bd81b5bc0e534de7b5ed02ba8987d15d8fd56c4475f891a686",
                role: "admin",
                email: "place@holder",
                contact_number: "123456789"
            },
            {
                username: "admin",
                salt: "6064a79ee24cb84ae357d026454713cfcb9448d91afb296bd5d2f7f725ada485",
                hash: "ce2477d962b6c19c5d9f8e4e94b8543fa97bb9b98584f765cf09a8e4397837033d45f89adda379055b1e9055aa7f2c28ffbd6307245e04da78f67ee13d438d1c1df22fc8db971226fc06a8b51c73efabdad89722a933e98b08bea5006dbbf8c7a00f18609b6bdf7c76e5f5dc96e8252adfdb240c81ba106469e3667fe339c3d62f83e7b78d2f91db099bc3d3e06bc3dd0a75eaaa69612b78762b0e3959d57a736f3fd7ead39a91e91c126426d1507be06fbea0f7cae144c621aacc4bece72ce245e042d0e4f7ca5a447c89bca5c29a7778e31623b3f07d5382c50d57da8c05c8b93b3a174f4045379b66834214e7fcb26eda708470867dd0beb36467bc27bad53ea64017e47bef71fc6b336d2f1f705b360985f9dab603a583c155e218bb0c89e8288e28c46eed38327d5373548a75e9bbf4e760eb649e497a2004be76b19dbc8e7b8d0a2d7d47eab9ba495e82e117e903a2e75a9921d55a1b6dcca56ee5e76c3517dec567f41541e9950b9ddfa42a182a59643be1b197ce108d8f01c01a1a3761b23f90c730e101a2059ccf3c8e908c7f4ed4f271fccb20b1a2c379bf74c432b2bdf314ec11ece583e5899c7b2942c66b66a3139c992c5574cd4f146628b8ab06c13d07636b27c22bcb98386d387ea34e0859a193a7ed995f9283132f1109596f9316b8761c048292835e56e27be6c31c8597638a48bc132eec64bb8351daa5",
                role: "admin",
                email: "place@holder",
                contact_number: "123456789"
            },
            {
                username: "staff",
                salt: "ff39d194a31495656fced5fa407149022b16f547c48c395d181eeb888107166f",
                hash: "bc2555e7d8bf2b5ea2c9cbf644fa3c85aa092023394b141065cbd3606af490f3f8f3afd37cd8706d045b4d7e635a4507957e1dc84ac966901d0a98c7bc37fdfc66431cfe569805cf2131b8bff57ce6665350812ff18f307c11bdc6c70191e82e66edcd5409abfe8dd34b3964e9ecb73ce78164ad8aaa6a2cbf531f9d3243e3ec852ea28fecc712147ec00ae2196831ac6099b05d98fbee22abecff6a91fee9300b5dfca6e330ef0a4fbf98e603b69fb6974da0de60606106d6058ad2cc9e81ab0090b9f733dd0b45fe483643a373be3de544825ca2b1a2ff2424508a0425d0d05a46bd60c2dea089b040a4207fd9e03171feb17fc0c9fc7ab1b76f8bbf3e304d96746441eed59c32de2d03c6b82a207cd5d14960768e5a8abced6457b18792baf8966dad3141d0f3fc717ef08077d110fa2bf3d36053e83c300c6aee950817d66169f3935dcbf7b5894a6351b5f5864ed580d4db44d3ef9f2a7dcc281fb0950ddbae5657c275ba80a584a4f553229461745f96e2072de645b0528e429888dd0b49b5326f49a3ee4e01e53253ed3af715e745240ca4b53e83dee320f6bd345acc60a2613e6b8977663483585925ef9b1d48e296245d9b0128a0d0b8d1ca3f56905b6b34f6a1bc8e17ad37f3ebc57a560a4a4aa214e9e6039887d6a68a0c41c4e08f1824f998ba8e36ca491e7e78f84174c544dde51d2ac3b9fe3fbd34693d435a",
                role: "staff",
                email: "place@holder",
                contact_number: "123456789"
            },
            {
                username: "minister",
                salt: "17f74278e14fda98339a74966acfd7845a4da0550524e1b31b260368828c6f90",
                hash: "6c22ceeb8af7992f1f0947cd153b2f43afd1a09d909303c50122fe83bf9368c762c104ab7830bddda486c78e8132befce0e71702d89d9d29f95ec082bc318127d692262beac877eb273436a1d0de9d8358df72048952aa8e8ae218f2292857a70ebf612f086fbc1af0cee28571ecc682e32f361bcd0fe4113b539868334c3d0145415480281c093df71995c02c0207f263943bea324b3c495992500b3060fb871064e95dc3f32ac45a82a27991f21be5ce2ce2ff9b76683d555416916c1979a0922d74aeb1a4ff4557ee9df77b4a7665c33ca468ae8810c271d544105362346a5444ac252ab812ec1b98379b9ffe6caa8610fdee87ef3b4c66bca327b6bf3bd3109b4f854874b2376686b0ca1f7e2a0601b79e3c5b6df37dfb049fa427d2ae104d3eea18792241376d7578e67dd31a6cf1cbc06d5696d36e50610a4c99848dbe869c97ee41400865b73310f03cc8ed4fed43fcf7bf62eebb18773d9fee34324d351e3b10f99d0cfedbafb68785a51cbfe3c1283c57a8b2aec0bbcabe21e36a853b071ff09719310915596dadccb2cb814b4ed5323f34b8637cbec3a8794595a76d421c971b8606de1aa7067c796cf91922867e58e8c7e17a01367aa3586b1035b7bdecc1254362e9af99b0da7752eb681781ab9a017c3936367debbf16ae1444b2561d65abd3438f3bbb393422a0db06864b646b6a436cc21bff319fd2d86638",
                role: "minister",
                email: "place@holder",
                contact_number: "123456789"
            }

        ]
    }
]