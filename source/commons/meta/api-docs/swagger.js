require('dotenv');
const errors = require('./error');
const swagger = {
  openapi: '3.0.3',
  info: {
    title: 'Gateway',
    description:
      'Updated: [20220629] | All req must have Authorization[:accessToken] in headers { exceptions: [/login/*] }',
    contact: {
      email: 'avakash.cse@gmail.com',
    },
    version: '3.0.0',
  },
  servers: [
    {
      name: 'DDA AWS',
      url: `http://http://65.1.216.213:9091`,
    },
  ],
  tags: [
    {
      name: 'Logout',
      description: 'DDA : logout APIs',
    },
    {
      name: 'Login',
      description: 'DDA : login APIs',
    },
    {
      name: 'Password',
      description: 'DDA : Password APIs',
    },
    {
      name: 'User',
      description: 'DDA : user/profile APIs',
    },
    {
      name: 'Doctor',
      description: 'DDA : doctor APIs',
    },
    {
      name: 'Problem',
      description: 'DDA : Problems APIs',
    },
    {
      name: 'Test',
      description: 'DDA : Tests APIs',
    },
    {
      name: 'Appointment',
      description: 'DDA : Appointment APIs',
    },
    {
      name: 'Surgery',
      description: 'DDA : Surgery APIs',
    },
  ],
  paths: {
    '/logout': {
      put: {
        tags: ['Logout'],
        summary:
          'Initiates logout process; revokes access and refresh token; pass both Authorization[:accessToken] and RefreshToken[:refreshToken] in headers',
        operationId: 'logout',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Logout',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      status: 200,
                      type: 'success',
                      message: 'Success! Access token revoked...',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/insurance/submitDetails': {
      post: {
        tags: ['Insurance'],
        summary: 'Creating insurance submission',
        operationId: 'Insurance',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                Insurance: {
                  summary: '200 - Insurance Submission',
                  value: require('../sample-data/api/insuranceSubmission/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/banner/createBanner/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/user/profile-edit': {
      post: {
        tags: ['profile-edit'],
        summary: 'Update profile',
        operationId: 'profile',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                Profile: {
                  summary: '200 - Profile update',
                  value: require('../sample-data/api/user/profileUpdate/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/user/profileUpdate/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/user/deleteAccount': {
      post: {
        tags: ['delete'],
        summary: 'Delete',
        operationId: 'delete',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                Delete: {
                  summary: '200 - Delete user',
                  value: require('../sample-data/api/user/deleteUserAccount/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/user/deleteUserAccount/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/getPatient/:doctorId': {
      get: {
        tags: ['Patient'],
        summary: 'Get Patients',
        operationId: 'Patient',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                Patient: {
                  summary: '200 - Patient',
                  value: require('../sample-data/api/doctorGet/request.json'),
                },
              },
            },
          },
        },
      },
    },
    '/api/admin/createAdmin': {
      post: {
        tags: ['Admin'],
        summary: 'Creating Admin',
        operationId: 'admin',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                Admin: {
                  summary: '200 - Admin',
                  value: require('../sample-data/api/admin/createAdmin/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/admin/createAdmin/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/admin/getAppLink': {
      post: {
        tags: ['Admin'],
        summary: 'Get Applink',
        operationId: 'admin',
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/admin/getApplink/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    // "/api/admin/login": getConfig({
    //   method: 'post', tags: ['Admin'],
    //   "summary": "Admin login with email/mobile and password",
    //   operationId: 'login', produces: 'application/json',
    //   successDescription: "Admin Logged In successfully",
    //   requestExamplePath: '../sample-data/api/admin/login/request.json',
    //   responseExamplePath: '../sample-data/api/admin/login/success.json',
    // }),
    '/api/policy/list': {
      get: {
        tags: ['Policy'],
        summary: 'Get policy',
        operationId: 'Policy',
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/policy/list/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/insurance/list': {
      get: {
        tags: ['Insurance'],
        summary: 'Get Insurance',
        operationId: 'Insurance',
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/insurance/list/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/banner/create': {
      post: {
        tags: ['Banner'],
        summary: 'Creating Banner',
        operationId: 'banner',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                Banner: {
                  summary: '200 - Banner',
                  value: require('../sample-data/api/banner/createBanner/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/banner/createBanner/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/banner/list': {
      get: {
        tags: ['Banner'],
        summary: 'Get Banner',
        operationId: 'Banner',
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/banner/listBanner/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/terms/createTerms': {
      post: {
        tags: ['Terms and Condition'],
        summary: 'Creating Terms and Condition',
        operationId: 'termsandcondition',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                'Terms and Condition': {
                  summary: '200 - Terms and Condition',
                  value: require('../sample-data/api/terms/createTerms/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/terms/createTerms/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/terms/getTerms': {
      get: {
        tags: ['Terms and Condition'],
        summary: 'Get Terms and Condition',
        operationId: 'TermsandCondition',
        responses: {
          success: {
            description: 'Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/terms/getTerms/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/terms/acceptTerms': {
      patch: {
        tags: ['Terms and Condition'],
        summary: 'Accept Terms and Condition',
        operationId: 'termsandcondition',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                'Terms and Condition': {
                  summary: '200 - Terms and Condition',
                  value: require('../sample-data/api/terms/acceptTerms/request.json'),
                },
              },
            },
          },
        },
      },
    },
    '/login/local': {
      patch: {
        tags: ['Login'],
        summary: 'Initiates login process using username:password',
        operationId: 'local-login',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - Mobile-OTP': {
                  summary: '200 - ECOM-V2 - Mobile-OTP',
                  value: require('../sample-data/api/login/localLogin/request.json'),
                },
                '200 - ECOM-V2 - Email-Password': {
                  summary: '200 - ECOM-V2 - Email-Password',
                  value: require('../sample-data/api/login/localLogin/request2.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Login Success',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/login/localLogin/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/login/otp': {
      patch: {
        tags: ['Password'],
        summary: 'Generates OTP against mobile/email provided',
        operationId: 'otp-login',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - Generate Email/Mobile-OTP': {
                  summary: '200 - ECOM-V2 - Generate Email/Mobile-OTP',
                  value: require('../sample-data/api/login/localLogin/request3.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'OTP Generated',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/login/localLogin/success2.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/login/generateOtp': {
      put: {
        tags: ['Login'],
        summary: 'Generate otp',
        operationId: 'generate-otp',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - GATEWAY - Generate OTP': {
                  summary: '200 - GATEWAY - Generate OTP',
                  value: require('../sample-data/api/login/localLogin/request5.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'OTP Generated',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/login/localLogin/success5.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/login/reset/password': {
      put: {
        tags: ['Password'],
        summary: 'Resets password. Works in tandem with /login/otp',
        operationId: 'reset-password',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - GATEWAY - Reset Profile Password': {
                  summary: '200 - GATEWAY - Reset Profile Password',
                  value: require('../sample-data/api/login/localLogin/request4.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'OTP Generated',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/login/localLogin/success3.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/doctor/create': {
      post: {
        tags: ['Doctor'],
        summary: "Add doctor's details",
        operationId: 'doctor-add',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                Register: {
                  summary: '200 - Register',
                  value: require('../sample-data/api/user/register/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Doctor details added',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/doctor/add/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/login/twitter': {
      get: {
        tags: ['Login'],
        summary: 'Initiates login process using Twitter auth',
        operationId: 'twitter-login',
        responses: {
          success: {
            description:
              'Login Params embedded in URL { userId, accessToken, refreshToken, expiresAt }',
            content: {},
          },
        },
      },
    },
    '/login/refresh': {
      put: {
        tags: ['Login'],
        summary:
          'Generates fresh access-token by passing refresh-token [:RefreshToken] in headers',
        operationId: 'refresh-login',
        responses: {
          success: {
            description: 'Access Token Refresh',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/login/localLogin/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/gw/api/user/permissions/:appType': {
      get: {
        tags: ['Login'],
        summary:
          '@DEPRECATED : Returns hierarchical component wise configuration of front-end UAC',
        parameters: [
          {
            in: 'path',
            name: 'appType',
            schema: {
              type: 'string',
            },
            required: true,
            description:
              'AppType -> [pax, storeportal, serviceportal, airportportal, commandcenter, helpdesk]',
          },
        ],
        operationId: 'user-permission-config',
        responses: {
          success: {
            description: 'UAC config for front-end applications',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - ECOM-V2',
                    value: require('../sample-data/api/login/permissions/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/gw/api/user/permissions/v2/:appType': {
      get: {
        tags: ['Login'],
        summary:
          'Returns flat permissions config for UAC; overrides already taken care of',
        parameters: [
          {
            in: 'path',
            name: 'appType',
            schema: {
              type: 'string',
            },
            required: true,
            description:
              'Suggestions for parameter : AppType -> [pax, storeportal, serviceportal, airportportal, commandcenter, helpdesk]',
          },
        ],
        operationId: 'user-permissionv2-config',
        responses: {
          success: {
            successDescription: 'Doctor Info',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        createdAt: '2022-08-14T07:07:46.224Z',
                        _id: '212345232342345345',
                        firstName: 'First name',
                        lastName: 'Lats name',
                        problem: [
                          {
                            icons: ['Image Url', 'Image url'],
                            _id: '62cc02777028f3f57f6a2070',
                            problemName: 'problem 1',
                            displayName: 'displayName',
                          },
                        ],
                        test: [
                          {
                            icons: ['Image Url', 'Image url'],
                            _id: '22ab02899028f1f77f6a1543',
                            testName: 'Test 1',
                            displayName: 'displayName',
                            description: 'Some description',
                          },
                        ],
                        availability: [
                          {
                            _id: '62f8a08613503b17f0ed4899',
                            day: 'Monday',
                            slot: [
                              {
                                _id: '62f8a08613503b17f0ed489a',
                                time: '2:00 PM',
                                isAvailable: true,
                              },
                              {
                                _id: '62f8a08613503b17f0ed489b',
                                time: '4:00 PM',
                                isAvailable: true,
                              },
                              {
                                _id: '62f8a08613503b17f0ed489c',
                                time: '6:00 PM',
                                isAvailable: true,
                              },
                            ],
                          },
                          {
                            _id: '62f8a08613503b17f0ed489d',
                            day: 'Tuesday',
                            slot: [
                              {
                                _id: '62f8a08613503b17f0ed489e',
                                time: '12:00 PM',
                                isAvailable: true,
                              },
                              {
                                _id: '62f8a08613503b17f0ed489f',
                                time: '3:00 PM',
                                isAvailable: true,
                              },
                              {
                                _id: '62f8a08613503b17f0ed48a0',
                                time: '4:00 PM',
                                isAvailable: true,
                              },
                            ],
                          },
                        ],
                        review: [],
                        updatedAt: '2022-08-14T07:13:10.210Z',
                        __v: 0,
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/list/:city': {
      get: {
        tags: ['Doctor'],
        summary: "Get doctor's information by city",
        operationId: 'BasicDoctorInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Doctor Info',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          location: {
                            _id: '23454561d32v',
                            flatNo: 12,
                            city: 'Indore',
                            district: 'String',
                            state: 'String',
                          },
                          createdAt: '2022-08-14T07:54:46.236Z',
                          _id: '21234523234234345',
                          firstName:
                            '31653135313163353965363437396130:142b7df51575959cb955988cb1b04445',
                          lastName:
                            '31653135313163353965363437396130:35dad2f343401d0e5cbc4878219de61f',
                          qualification: 'Qualifications',
                          problem: [
                            {
                              icons: ['Image Url', 'Image url'],
                              _id: '62cc02777028f3f57f6a2070',
                              problemName: 'problem 1',
                              displayName: 'displayName',
                            },
                          ],
                          test: [
                            {
                              icons: ['Image Url', 'Image url'],
                              _id: '22ab02899028f1f77f6a1543',
                              testName: 'Test 1',
                              displayName: 'displayName',
                              description: 'Some description',
                            },
                          ],
                          availability: [
                            {
                              _id: '62f8ac226c3ff81b0c59a887',
                              day: 'Monday',
                              slot: [
                                {
                                  _id: '62f8ac226c3ff81b0c59a888',
                                  time: '2:00 PM',
                                  isAvailable: true,
                                },
                                {
                                  _id: '62f8ac226c3ff81b0c59a889',
                                  time: '4:00 PM',
                                  isAvailable: true,
                                },
                                {
                                  _id: '62f8ac226c3ff81b0c59a88a',
                                  time: '6:00 PM',
                                  isAvailable: true,
                                },
                              ],
                            },
                            {
                              _id: '62f8ac226c3ff81b0c59a88b',
                              day: 'Tuesday',
                              slot: [
                                {
                                  _id: '62f8ac226c3ff81b0c59a88c',
                                  time: '12:00 PM',
                                  isAvailable: true,
                                },
                                {
                                  _id: '62f8ac226c3ff81b0c59a88d',
                                  time: '3:00 PM',
                                  isAvailable: true,
                                },
                                {
                                  _id: '62f8ac226c3ff81b0c59a88e',
                                  time: '4:00 PM',
                                  isAvailable: true,
                                },
                              ],
                            },
                          ],
                          review: [],
                          updatedAt: '2022-08-14T08:02:42.235Z',
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/update/:id': {
      post: {
        tags: ['Doctor'],
        summary: "Update doctor's details",
        parameters: require('../sample-data/api/doctor/edit/parameters.json'),
        operationId: 'doctor-edit',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - Add Doctor': {
                  summary: '200 - Add doctor',
                  value: require('../sample-data/api/doctor/edit/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Doctor details added',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/doctor/edit/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/doctor/problem/add': {
      post: {
        tags: ['Problem'],
        summary: 'Add problem details',
        operationId: 'problem-add',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - Add Problem': {
                  summary: '200 - Add problem',
                  value: require('../sample-data/api/problem/add/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Problem added',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/problem/add/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/problem/list': {
      get: {
        tags: ['Problem'],
        summary: 'Get all problems information',
        operationId: 'allProblemInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Problems Info',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          createdAt: '2022-07-26T10:40:44.295Z',
                          icons: ['url1', 'url2'],
                          _id: '62cc02777028f3f57f6a2070',
                          problemName: 'problem 1',
                          displayName: 'short name1',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-07-26T11:19:38.793Z',
                          icons: ['url1', 'url2'],
                          _id: '62aa02777028f3f77f6a1090',
                          problemName: 'problem 2',
                          displayName: 'short name2',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-07-26T11:20:16.536Z',
                          icons: ['url1', 'url2'],
                          _id: '62aa02999028f3f77f6a1299',
                          problemName: 'problem 3',
                          displayName: 'short name2',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-07-26T16:40:52.224Z',
                          icons: ['url1', 'url2'],
                          _id: '145b02878928f1a97f6a1543',
                          problemName: 'Problem 5 ',
                          displayName: 'short name5',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-07-26T17:06:14.603Z',
                          icons: [],
                          _id: '378468172436234',
                          updatedAt: '2022-07-26T17:07:46.838Z',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-07-26T17:58:44.387Z',
                          icons: ['url1', 'url2'],
                          _id: '145b028781a97f6a1543',
                          problemName: 'Problem 5 ',
                          displayName: 'short name5',
                          updatedAt: '2022-07-26T18:01:59.562Z',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-14T08:09:36.206Z',
                          icons: ['url1', 'url2'],
                          _id: '45b028781a97f6a1543',
                          problemName: 'Some Problem',
                          displayName: 'Its short name',
                          updatedAt: '2022-08-14T08:13:25.425Z',
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/problem/list/:id': {
      get: {
        tags: ['Problem'],
        summary: 'Get problem by id',
        operationId: 'ProblemInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Problem Info by Id',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        createdAt: '2022-07-26T10:40:44.295Z',
                        icons: ['url1', 'url2'],
                        _id: '62cc02777028f3f57f6a2070',
                        problemName: 'problem 1',
                        displayName: 'short name1',
                        __v: 0,
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/test/add': {
      post: {
        tags: ['Test'],
        summary: 'Add Test details',
        operationId: 'test-add',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - Add Test': {
                  summary: '200 - Add test',
                  value: require('../sample-data/api/test/add/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Test added',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/test/add/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/test/list': {
      get: {
        tags: ['Test'],
        summary: 'Get all tests',
        operationId: 'allTestInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Tests Info',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          createdAt: '2022-07-26T16:40:52.226Z',
                          icons: ['url1', 'url2'],
                          _id: '22ab02899028f1f77f6a1543',
                          displayName: 'short name1',
                          description: 'Some teset description1',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-07-26T17:58:44.390Z',
                          icons: ['url1', 'url2'],
                          _id: '145b02878928f1a97f6a1543',
                          displayName: 'short name5',
                          description: 'Some teset description1',
                          updatedAt: '2022-07-26T18:02:25.281Z',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-13T07:05:50.204Z',
                          icons: ['url1', 'url2'],
                          _id: '145b0287833928f1a97f6a1543',
                          displayName: 'short name5',
                          description: 'Some teset description1',
                          updatedAt: '2022-08-13T07:24:50.121Z',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-13T07:05:50.204Z',
                          icons: ['url1', 'url2'],
                          _id: '145b0233928f1a97f6a1543',
                          testName: 'test 5 ',
                          displayName: 'short name5',
                          description: 'Some teset description1',
                          updatedAt: '2022-08-13T07:25:59.365Z',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-14T08:09:36.258Z',
                          icons: ['url1', 'url2'],
                          _id: '145b023928f1a97f6a1543',
                          testName: 'Teset name',
                          displayName: 'Its short name',
                          description: 'Some test description1',
                          updatedAt: '2022-08-14T08:14:54.506Z',
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/test/list/:id': {
      get: {
        tags: ['Test'],
        summary: 'Get test by id',
        operationId: 'TestInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Test Info by Id',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        createdAt: '2022-07-26T16:40:52.226Z',
                        icons: ['url1', 'url2'],
                        _id: '22ab02899028f1f77f6a1543',
                        displayName: 'short name1',
                        description: 'Some teset description1',
                        __v: 0,
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/appointment/bookAppointment': {
      post: {
        tags: ['Appointment'],
        summary: "Add user's Appointment with doctor",
        operationId: 'appointment-add',
        consumes: ['application/json'],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - Add appointment': {
                  summary: '200 - Add appointment',
                  value: require('../sample-data/api/appointment/add/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'appointment added',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/appointment/add/success.json'),
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/appointment/listAppointments': {
      get: {
        tags: ['Appointment'],
        summary: 'Get all appointment',
        operationId: 'allAppointmentInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Appointment Info',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          scheduleDate: {
                            availabilityId: '62eabc5a090053143cc5b155',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62eabc5a090053143cc5b156',
                          },
                          createdAt: '2022-08-04T09:38:55.015Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62eb93afe6dc2309c0af7c38',
                          updatedAt: '2022-08-04T09:38:55.026Z',
                          patientName:
                            '31653135313163353965363437396130:3d14431b5bc3477197fdd85a7299e89d',
                          patientAge:
                            '31653135313163353965363437396130:8c1f808b4c4e34275e60af4254339d3b',
                          problem: [],
                          test: [],
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62eabc5a090053143cc5b155',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62eabc5a090053143cc5b156',
                          },
                          createdAt: '2022-08-04T09:39:42.319Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62eb93de00fe7611046257ef',
                          updatedAt: '2022-08-04T09:39:42.329Z',
                          patientName:
                            '31653135313163353965363437396130:3d14431b5bc3477197fdd85a7299e89d',
                          patientAge:
                            '31653135313163353965363437396130:8c1f808b4c4e34275e60af4254339d3b',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62eabc5a090053143cc5b155',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62eabc5a090053143cc5b156',
                          },
                          createdAt: '2022-08-04T09:42:25.806Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62eb9481c294e7091077ff0f',
                          updatedAt: '2022-08-04T09:42:25.817Z',
                          patientName:
                            '31653135313163353965363437396130:3d14431b5bc3477197fdd85a7299e89d',
                          patientAge:
                            '31653135313163353965363437396130:8c1f808b4c4e34275e60af4254339d3b',
                          problem: [],
                          test: [],
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-04T09:43:01.920Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62eb94a5fcf0ff175cc5bc7f',
                          updatedAt: '2022-08-04T09:43:01.928Z',
                          patientName: '',
                          patientAge: '',
                          problem: [],
                          test: [],
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62eabc5a090053143cc5b155',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62eabc5a090053143cc5b156',
                          },
                          createdAt: '2022-08-04T09:46:19.803Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62eb956bf4df551318629233',
                          updatedAt: '2022-08-04T09:46:19.816Z',
                          patientName:
                            '31653135313163353965363437396130:3d14431b5bc3477197fdd85a7299e89d',
                          patientAge:
                            '31653135313163353965363437396130:8c1f808b4c4e34275e60af4254339d3b',
                          problem: [],
                          test: [],
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62eabc5a090053143cc5b157',
                            day: 'Tuesday',
                            time: '12:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62eabc5a090053143cc5b158',
                          },
                          createdAt: '2022-08-04T09:47:02.301Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: false,
                          _id: '62eb9596e32a14179c4da363',
                          updatedAt: '2022-08-04T09:47:02.322Z',
                          patientName:
                            '31653135313163353965363437396130:3d14431b5bc3477197fdd85a7299e89d',
                          patientAge:
                            '31653135313163353965363437396130:8c1f808b4c4e34275e60af4254339d3b',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                          doctorId: '4584681452a234534034',
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T08:53:24.171Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b8042f0cfa1bb42e829d',
                          updatedAt: '2022-08-14T08:53:24.186Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T08:54:58.523Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b86217caf51870513085',
                          updatedAt: '2022-08-14T08:54:58.540Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T08:58:30.539Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b936cb78a41ba037078d',
                          updatedAt: '2022-08-14T08:58:30.558Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T08:59:10.893Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b95e9a5d610098a28c48',
                          updatedAt: '2022-08-14T08:59:10.908Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:00:29.050Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b9ad9a5d610098a28c4d',
                          updatedAt: '2022-08-14T09:00:29.054Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:00:41.331Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b9b99a5d610098a28c51',
                          updatedAt: '2022-08-14T09:00:41.334Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:03:15.206Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8ba53711bbb172ce7c9bb',
                          updatedAt: '2022-08-14T09:03:15.217Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:03:26.525Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8ba5e711bbb172ce7c9c1',
                          updatedAt: '2022-08-14T09:03:26.531Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'All apointment list fetched successfully .',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/appointment/list': {
      get: {
        tags: ['Appointment'],
        summary: 'Get users appointment by its token',
        operationId: 'UsersAppointmentInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: "User's Appointment by its token",
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          scheduleDate: {
                            availabilityId: '62eabc5a090053143cc5b155',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62eabc5a090053143cc5b156',
                          },
                          createdAt: '2022-08-04T09:39:42.319Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62eb93de00fe7611046257ef',
                          updatedAt: '2022-08-04T09:39:42.329Z',
                          patientName:
                            '31653135313163353965363437396130:3d14431b5bc3477197fdd85a7299e89d',
                          patientAge:
                            '31653135313163353965363437396130:8c1f808b4c4e34275e60af4254339d3b',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62eabc5a090053143cc5b157',
                            day: 'Tuesday',
                            time: '12:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62eabc5a090053143cc5b158',
                          },
                          createdAt: '2022-08-04T09:47:02.301Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: false,
                          _id: '62eb9596e32a14179c4da363',
                          updatedAt: '2022-08-04T09:47:02.322Z',
                          patientName:
                            '31653135313163353965363437396130:3d14431b5bc3477197fdd85a7299e89d',
                          patientAge:
                            '31653135313163353965363437396130:8c1f808b4c4e34275e60af4254339d3b',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                          doctorId: '4584681452a234534034',
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T08:54:58.523Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b86217caf51870513085',
                          updatedAt: '2022-08-14T08:54:58.540Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T08:59:10.893Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b95e9a5d610098a28c48',
                          updatedAt: '2022-08-14T08:59:10.908Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:00:29.050Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b9ad9a5d610098a28c4d',
                          updatedAt: '2022-08-14T09:00:29.054Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:00:41.331Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8b9b99a5d610098a28c51',
                          updatedAt: '2022-08-14T09:00:41.334Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:03:15.206Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8ba53711bbb172ce7c9bb',
                          updatedAt: '2022-08-14T09:03:15.217Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [],
                          test: [],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                        {
                          scheduleDate: {
                            availabilityId: '62f8aa616c3ff81b0c59a871',
                            day: 'Monday',
                            time: '2:00 PM',
                            date: '2022-08-03T18:30:00.000Z',
                            slotId: '62f8aa616c3ff81b0c59a872',
                          },
                          createdAt: '2022-08-14T09:03:26.525Z',
                          status: 'ACTIVE',
                          isCancelled: false,
                          isCompleted: false,
                          isUpcoming: true,
                          _id: '62f8ba5e711bbb172ce7c9c1',
                          updatedAt: '2022-08-14T09:03:26.531Z',
                          patientName: 'Patient Name',
                          patientAge: '23',
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '45b028781a97f6a1543',
                              problemName: 'Some Problem',
                              displayName: 'Its short name',
                            },
                          ],
                          test: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b023928f1a97f6a1543',
                              testName: 'Test name',
                              displayName: 'Its short name',
                              description: 'Some test description1',
                            },
                          ],
                          userId: '1234',
                          appointmentType: 'VIDEO_CALL',
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message:
                        'List of your appointments fetched successfully .',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/appointment/cancel': {
      patch: {
        tags: ['Appointment'],
        summary: 'cancel users appointment by its token',
        operationId: 'CancelUsersAppointment',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - Cancel appointment': {
                  summary: '200 - ECOM-V2 - Cancel appointment',
                  value: require('../sample-data/api/appointment/cancel/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Appointment cancelled',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/appointment/cancel/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/appointment/reschedule': {
      patch: {
        tags: ['Appointment'],
        summary: 'reschedule users appointment by its token',
        operationId: 'RescheduleUsersAppointment',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - Reschedule appointment': {
                  summary: '200 - ECOM-V2 - Reschedule appointment',
                  value: require('../sample-data/api/appointment/reschedule/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Appointment rescheduled',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/appointment/reschedule/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/user/consultation/create': {
      post: {
        tags: ['Consultation'],
        summary: 'create consultation',
        operationId: 'createConsultation',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - create consultation': {
                  summary: '200 - ECOM-V2 - Create consultation',
                  value: require('../sample-data/api/consultation/add/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Create consultation',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/consultation/add/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/user/consultation/list': {
      get: {
        tags: ['Consultation'],
        summary: 'Get users consultation by its token',
        operationId: 'UsersConsultationInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: "User's consultation by its token",
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          _id: '3ww498573422349834d579',
                          createdAt: '2022-07-30T12:39:07.947Z',
                          updatedAt: '2022-07-30T12:39:07.947Z',
                          name: 'somename',
                          doctorId: {
                            _id: '378468172436234',
                            firstName: 'Name1',
                            lastName: 'lastname1',
                          },
                          userId: 'Here all user details in an object',
                          appointmentId: '123234234',
                          summary: 'SOme summary',
                          dateTime: '2022-07-30T12:48:54.870Z',
                          meds: [
                            {
                              name: ['eds1,meds2,meds3'],
                              _id: '62e528b6a4e5921168b9f94f',
                              sNumber: 3,
                              isLatest: true,
                            },
                            {
                              name: ['eds1,meds2,meds3'],
                              _id: '62e527b16bf65618f8aa456b',
                              sNumber: 2,
                              isLatest: false,
                            },
                            {
                              name: ['dolo', 'paracteol'],
                              _id: '62e52686a5783f09d09322da',
                              sNumber: 1,
                              isLatest: false,
                            },
                          ],
                          problem: [
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b028781a97f6a1543',
                              problemName: 'Problem5 ',
                              displayName: 'short name5',
                              sNumber: 5,
                              isLatest: true,
                            },
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b028781a97f6a1543',
                              problemName: 'Problem4 ',
                              displayName: 'short name4',
                              sNumber: 3,
                              isLatest: false,
                            },
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b028781a97f6a1543',
                              problemName: 'Problem5 ',
                              displayName: 'short name5',
                              sNumber: 4,
                              isLatest: false,
                            },
                            {
                              icons: ['url1', 'url2'],
                              _id: '145b028781a97f6a1543',
                              problemName: 'Problem 1 ',
                              displayName: 'short name1',
                              sNumber: 1,
                              isLatest: false,
                            },
                            {
                              icons: ['url1', 'url2'],
                              _id: '62aa02777028f3f77f6a1090',
                              problemName: 'Problem 2 ',
                              displayName: 'short name2',
                              sNumber: 2,
                              isLatest: false,
                            },
                          ],
                          test: null,
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/user/consultation/edit': {
      patch: {
        tags: ['Consultation'],
        summary: 'edit consultation',
        operationId: 'editConsultation',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - edit consultation': {
                  summary: '200 - ECOM-V2 - Edit consultation',
                  value: require('../sample-data/api/consultation/edit/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Edit consultation',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/consultation/edit/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/doctor/medicine/create': {
      post: {
        tags: ['Medicine'],
        summary: 'create Medicine',
        operationId: 'createMedicine',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - create Medicine': {
                  summary: '200 - ECOM-V2 - Create Medicine',
                  value: require('../sample-data/api/medicine/add/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'create Medicine',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/medicine/add/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/doctor/review/add': {
      post: {
        tags: ['Doctor'],
        summary: 'Add Review For A Doctor',
        operationId: 'addReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            undefined: {
              schema: { type: 'object' },
              example: {
                doctorId: 'doc1',
                reviewDescription: '3rd Review',
                reviewRating: 2,
                reviewedUsedId: 'user123',
                reviewedUserMail: 'manu01@gmail.com',
                reviewedUserName: 'Manoj H R',
                reviewedDate: '29/07/2022',
              },
            },
          },
        },
        parameters: null,
        responses: {
          success: {
            successDescription: 'Added Review For A Doctor',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        location: 'Hassan',
                        createdAt: '2022-07-29T04:25:39.351Z',
                        _id: 'doc1',
                        firstName:
                          '31653135313163353965363437396130:5cc8e394cdcef021dde878d2529e2bcf',
                        lastName:
                          '31653135313163353965363437396130:3893fffc2904b5750a72ae9732de6bc8',
                        problem: [],
                        test: [],
                        updatedAt: '2022-07-29T04:25:51.037Z',
                        __v: 0,
                        review: [
                          {
                            _id: '62e411d31baf9c0f5df83857',
                            reviewDescription:
                              "Lorem Ipsum isafkghshgodjgsjdglsdjgdsjgsjgspgjsgjs;pgjs;gjspgjgojgodsjgsjdgjg simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                            reviewRating: 2,
                            reviewedUserName: 'Manoj H R',
                            reviewedUserMail: 'manu.hr1701@gmail.com',
                            reviewedDate: '2022-07-29T16:58:59.946Z',
                            comments: [
                              {
                                _id: '62e412916cdd6410491f725d',
                                commentDescription: 'commentDescription',
                                commentedUserId: 'user231',
                                commentedUserName: 'manu',
                                commentedUserMail: 'manu@gmail.com',
                                commentedDate: '2022-07-29T17:02:09.304Z',
                              },
                              {
                                _id: '62e412c16cdd6410491f7260',
                                commentDescription: '2nd Comment',
                                commentedUserId: 'user231',
                                commentedUserName: 'manoj Kumar',
                                commentedUserMail: 'manu1234@gmail.com',
                                commentedDate: '2022-07-29T17:02:57.506Z',
                              },
                            ],
                          },
                        ],
                        availability: [],
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/review/comment/add': {
      post: {
        tags: ['Doctor'],
        summary: 'Add Comment For a Review Of A Doctor',
        operationId: 'addCommentToReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            undefined: {
              schema: { type: 'object' },
              example: {
                doctorId: 'doc1',
                reviewId: '62e413096cdd6410491f7263',
                commentDescription: '1st Comment',
                commentedUserId: 'user231',
                commentedUserName: 'manoj Kumar',
                commentedUserMail: 'manu1234@gmail.com',
                commentedDate: '29/07/2022',
              },
            },
          },
        },
        parameters: null,
        responses: {
          success: {
            successDescription: 'Added a Review For a Doctor',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        location: 'Hassan',
                        createdAt: '2022-07-29T04:25:39.351Z',
                        _id: 'doc1',
                        firstName:
                          '31653135313163353965363437396130:5cc8e394cdcef021dde878d2529e2bcf',
                        lastName:
                          '31653135313163353965363437396130:3893fffc2904b5750a72ae9732de6bc8',
                        problem: [],
                        test: [],
                        updatedAt: '2022-07-29T04:25:51.037Z',
                        __v: 0,
                        review: [
                          {
                            _id: '62e411d31baf9c0f5df83857',
                            reviewDescription:
                              "Lorem Ipsum isafkghshgodjgsjdglsdjgdsjgsjgspgjsgjs;pgjs;gjspgjgojgodsjgsjdgjg simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                            reviewRating: 2,
                            reviewedUserName: 'Manoj Kumar H R',
                            reviewedUserMail: 'manu.hr1701@gmail.com',
                            reviewedDate: '2022-07-29T16:58:59.946Z',
                            comments: [
                              {
                                _id: '62e412916cdd6410491f725d',
                                commentDescription: 'commentDescription',
                                commentedUserId: 'user231',
                                commentedUserName: 'manu',
                                commentedUserMail: 'manu@gmail.com',
                                commentedDate: '2022-07-29T17:02:09.304Z',
                              },
                              {
                                _id: '62e412c16cdd6410491f7260',
                                commentDescription: '2nd Comment',
                                commentedUserId: 'user231',
                                commentedUserName: 'manoj Kumar',
                                commentedUserMail: 'manu1234@gmail.com',
                                commentedDate: '2022-07-29T17:02:57.506Z',
                              },
                            ],
                          },
                          {
                            _id: '62e413096cdd6410491f7263',
                            reviewDescription: '@nd Review',
                            reviewRating: 2,
                            reviewedUserName: 'Manoj H R',
                            reviewedUserMail: 'manu01@gmail.com',
                            reviewedDate: '2022-07-29T17:04:09.444Z',
                            comments: [
                              {
                                _id: '62e413446cdd6410491f7265',
                                commentDescription: '1st Comment',
                                commentedUserId: 'user231',
                                commentedUserName: 'manoj Kumar',
                                commentedUserMail: 'manu1234@gmail.com',
                                commentedDate: '2022-07-29T17:05:08.745Z',
                              },
                              {
                                _id: '62f7180f25cc980ab2f2888c',
                                commentDescription: '1st Comment',
                                commentedUserId: 'user231',
                                commentedUserName: 'manoj Kumar',
                                commentedUserMail: 'manu1234@gmail.com',
                                commentedDate: '2022-08-13T03:18:39.997Z',
                              },
                            ],
                          },
                          {
                            _id: '62f712c072d0fc0808934abc',
                            reviewDescription: '3rd Review',
                            reviewRating: 5,
                            reviewedUserName: 'Manoj H R',
                            reviewedUserMail: 'manu01@gmail.com',
                            reviewedDate: '2022-08-13T02:56:00.122Z',
                            comments: [],
                          },
                        ],
                        availability: [],
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/app/review/create': {
      post: {
        tags: ['App'],
        summary: 'Post a Review For The Application',
        operationId: 'addAppReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            undefined: {
              schema: { type: 'object' },
              example: {
                reviewTitle: 'Third Review ',
                reviewDescripption:
                  'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old.',
                reviewDate: '02/07/2022',
                reviewedUserId: 'user123',
                reviewedUserName: 'Manoj H R',
                reviewedUserMail: 'manu.1701@gmail.com',
                reviewedUserMobile: '8277603447',
              },
            },
          },
        },
        parameters: null,
        responses: {
          success: {
            successDescription: 'Added a App Review',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        createdAt: '2022-08-13T03:21:49.279Z',
                        likes: [],
                        _id: '62f71a4926f1e10bc392246b',
                        reviewTitle: 'Third Review ',
                        reviewDate: '2022-08-13T03:28:09.000Z',
                        reviewedUserId: 'user123',
                        reviewedUserName: 'Manoj H R',
                        reviewedUserMail: 'manu.1701@gmail.com',
                        reviewedUserMobile: '8277603447',
                        reviewNoOfLikes: 0,
                        __v: 0,
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/app/review/list': {
      get: {
        tags: ['App'],
        summary: 'List All Reviews Of The Application',
        operationId: 'listAppReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Got all App Review',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          createdAt: '2022-08-02T06:10:53.336Z',
                          likes: ['user225'],
                          _id: '62e8c029c306601f360705c4',
                          reviewTitle: 'Second Review ',
                          reviewDate: '2022-08-02T06:11:53.000Z',
                          reviewedUserId: 'user1',
                          reviewedUserName: 'Manoj',
                          reviewedUserMail: 'manu.hr1701@gmail.com',
                          reviewedUserMobile: '8277603447',
                          reviewNoOfLikes: 0,
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-02T06:32:24.069Z',
                          likes: [
                            'user225',
                            'user213',
                            'user212',
                            'user214',
                            'user215',
                            'user216',
                            'user217',
                            'user218',
                            'user219',
                            'user220',
                            'user221',
                            'user222',
                            'user223',
                            'user224',
                          ],
                          _id: '62e8c5c6db197e219e7d84b4',
                          reviewTitle: 'First Review ',
                          reviewDate: '2022-08-02T06:35:50.000Z',
                          reviewedUserId: 'user123',
                          reviewedUserName: 'Manoj H R',
                          reviewedUserMail: 'manu.1701@gmail.com',
                          reviewedUserMobile: '8277603447',
                          reviewNoOfLikes: 13,
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-02T06:32:24.069Z',
                          likes: [],
                          _id: '62e8c5cddb197e219e7d84b6',
                          reviewTitle: 'First Review ',
                          reviewDate: '2022-08-02T06:35:57.000Z',
                          reviewedUserId: 'user123',
                          reviewedUserName: 'Manoj H R',
                          reviewedUserMail: 'manu.1701@gmail.com',
                          reviewedUserMobile: '8277603447',
                          reviewNoOfLikes: 0,
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-02T07:37:12.245Z',
                          likes: [
                            'user301',
                            'user302',
                            'user303',
                            'user304',
                            'user305',
                          ],
                          _id: '62e8d468b0259428410d11c7',
                          reviewTitle: 'Third Review ',
                          reviewDate: '2022-08-02T07:38:16.000Z',
                          reviewedUserId: 'user123',
                          reviewedUserName: 'Manoj H R',
                          reviewedUserMail: 'manu.1701@gmail.com',
                          reviewedUserMobile: '8277603447',
                          reviewNoOfLikes: 5,
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-13T03:21:49.279Z',
                          likes: [],
                          _id: '62f71a4926f1e10bc392246b',
                          reviewTitle: 'Third Review ',
                          reviewDate: '2022-08-13T03:28:09.000Z',
                          reviewedUserId: 'user123',
                          reviewedUserName: 'Manoj H R',
                          reviewedUserMail: 'manu.1701@gmail.com',
                          reviewedUserMobile: '8277603447',
                          reviewNoOfLikes: 0,
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },

    '/api/app/review/dislike': {
      post: {
        tags: ['App'],
        summary: 'Remove Like From The Review',
        operationId: 'dislikeAppReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            undefined: {
              schema: { type: 'object' },
              example: {
                reviewId: '62e8d468b0259428410d11c7',
                userId: 'user306',
              },
            },
          },
        },
        parameters: null,
        responses: {
          success: {
            successDescription: 'Removed The Like For The Review',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        createdAt: '2022-08-02T07:37:12.245Z',
                        likes: [
                          'user301',
                          'user302',
                          'user303',
                          'user304',
                          'user305',
                        ],
                        _id: '62e8d468b0259428410d11c7',
                        reviewTitle: 'Third Review ',
                        reviewDate: '2022-08-02T07:38:16.000Z',
                        reviewedUserId: 'user123',
                        reviewedUserName: 'Manoj H R',
                        reviewedUserMail: 'manu.1701@gmail.com',
                        reviewedUserMobile: '8277603447',
                        reviewNoOfLikes: 5,
                        __v: 0,
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },

    '/api/doctor/review/list/:doctorId': {
      get: {
        tags: ['Doctor'],
        summary: 'List Reviews For A Doctor',
        operationId: 'listReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: { undefined: { schema: { type: 'object' }, example: {} } },
        },
        parameters: null,
        responses: {
          success: {
            successDescription: 'Got All Reviews For A Doctor',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          _id: 'doc1',
                          review: [
                            {
                              _id: '62e411d31baf9c0f5df83857',
                              reviewDescription:
                                "Lorem Ipsum isafkghshgodjgsjdglsdjgdsjgsjgspgjsgjs;pgjs;gjspgjgojgodsjgsjdgjg simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
                              reviewRating: 2,
                              reviewedUserName: 'Manoj Kumar H R',
                              reviewedUserMail: 'manu.hr1701@gmail.com',
                              reviewedDate: '2022-07-29T16:58:59.946Z',
                              comments: [
                                {
                                  _id: '62e412916cdd6410491f725d',
                                  commentDescription: 'commentDescription',
                                  commentedUserId: 'user231',
                                  commentedUserName: 'manu',
                                  commentedUserMail: 'manu@gmail.com',
                                  commentedDate: '2022-07-29T17:02:09.304Z',
                                },
                                {
                                  _id: '62e412c16cdd6410491f7260',
                                  commentDescription: '2nd Comment',
                                  commentedUserId: 'user231',
                                  commentedUserName: 'manoj Kumar',
                                  commentedUserMail: 'manu1234@gmail.com',
                                  commentedDate: '2022-07-29T17:02:57.506Z',
                                },
                              ],
                            },
                            {
                              _id: '62e413096cdd6410491f7263',
                              reviewDescription: '@nd Review',
                              reviewRating: 2,
                              reviewedUserName: 'Manoj H R',
                              reviewedUserMail: 'manu01@gmail.com',
                              reviewedDate: '2022-07-29T17:04:09.444Z',
                              comments: [
                                {
                                  _id: '62e413446cdd6410491f7265',
                                  commentDescription: '1st Comment',
                                  commentedUserId: 'user231',
                                  commentedUserName: 'manoj Kumar',
                                  commentedUserMail: 'manu1234@gmail.com',
                                  commentedDate: '2022-07-29T17:05:08.745Z',
                                },
                              ],
                            },
                            {
                              _id: '62f712c072d0fc0808934abc',
                              reviewDescription: '3rd Review',
                              reviewRating: 5,
                              reviewedUserName: 'Manoj H R',
                              reviewedUserMail: 'manu01@gmail.com',
                              reviewedDate: '2022-08-13T02:56:00.122Z',
                              comments: [],
                            },
                          ],
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },

    '/api/doctor/review/comment/list/:doctorId/:reviewId': {
      get: {
        tags: ['Doctor'],
        summary: 'List Comment For a Review Of A Doctor',
        operationId: 'listCommentsOfAReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'Got The Comments Of A Review For a Doctor',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          _id: 'doc1',
                          review: [
                            {
                              comments: [
                                {
                                  _id: '62e413446cdd6410491f7265',
                                  commentDescription: '1st Comment',
                                  commentedUserId: 'user231',
                                  commentedUserName: 'manoj Kumar',
                                  commentedUserMail: 'manu1234@gmail.com',
                                  commentedDate: '2022-07-29T17:05:08.745Z',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/app/review/like': {
      post: {
        tags: ['App'],
        summary: 'Like The Review',
        operationId: 'likeAppReview',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: {
          required: true,
          content: {
            undefined: {
              schema: { type: 'object' },
              example: {
                reviewId: '62e8d468b0259428410d11c7',
                userId: 'user306',
              },
            },
          },
        },
        parameters: null,
        responses: {
          success: {
            successDescription: 'Liked The Review',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: {
                        createdAt: '2022-08-02T07:37:12.245Z',
                        likes: [
                          'user301',
                          'user302',
                          'user303',
                          'user304',
                          'user305',
                          'user306',
                        ],
                        _id: '62e8d468b0259428410d11c7',
                        reviewTitle: 'Third Review ',
                        reviewDate: '2022-08-02T07:38:16.000Z',
                        reviewedUserId: 'user123',
                        reviewedUserName: 'Manoj H R',
                        reviewedUserMail: 'manu.1701@gmail.com',
                        reviewedUserMobile: '8277603447',
                        reviewNoOfLikes: 6,
                        __v: 0,
                      },
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },

    '/api/doctor/medicine/list/:doctorId': {
      get: {
        tags: ['Medicine'],
        summary: 'Get all medicines by doctorId',
        operationId: 'allMedicinesInfo',
        consumes: [undefined],
        produces: ['application/json'],
        requestBody: null,
        parameters: null,
        responses: {
          success: {
            successDescription: 'All medicines selected by doctor',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - DDA APP',
                    value: {
                      data: [
                        {
                          createdAt: '2022-08-19T13:22:57.038Z',
                          _id: '62ff8ec3d02b231cc430c54b',
                          doctorId: '378468172436234',
                          name: 'Somemedsname',
                          icon: 'Some uirl for icon',
                          price: 1234,
                          updatedAt: '2022-08-19T13:23:15.651Z',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-19T16:27:17.611Z',
                          _id: '62ffba607ffe5f0d4092826f',
                          doctorId: '378468172436234',
                          name: 'Somemedsname',
                          icon: 'Some uirl for icon',
                          price: 1234,
                          updatedAt: '2022-08-19T16:29:20.234Z',
                          __v: 0,
                        },
                        {
                          createdAt: '2022-08-19T16:27:17.611Z',
                          _id: '62ffba6e7ffe5f0d40928272',
                          doctorId: '378468172436234',
                          name: 'Some meds name',
                          icon: 'Some url for icon',
                          price: 1234,
                          updatedAt: '2022-08-19T16:29:34.110Z',
                          __v: 0,
                        },
                      ],
                      status: 200,
                      type: 'success',
                      message: 'Ok',
                    },
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: 'Bad Request',
                    value: {
                      status: 400,
                      type: 'failure',
                      message: "Ain't you forgetting something in request ?",
                    },
                  },
                  {
                    summary: 'Unauthorized',
                    value: {
                      status: 401,
                      type: 'failure',
                      message: "Hold on smarty pants, I'm calling 911 :P",
                    },
                  },
                  {
                    summary: 'Forbidden',
                    value: {
                      status: 403,
                      type: 'failure',
                      message: "Hold up! You can't go in there...",
                    },
                  },
                  {
                    summary: 'Internal Server Error',
                    value: {
                      status: 500,
                      type: 'failure',
                      message:
                        "Oww Snap!! It's not you, it's us. Try in a bit.",
                    },
                  },
                  {
                    summary: 'Expired',
                    value: {
                      status: 498,
                      type: 'failure',
                      message: 'Your ticket to resource is expired!',
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    '/api/doctor/medicine/search': {
      post: {
        tags: ['Medicine'],
        summary: 'Search Medicine',
        operationId: 'searchMedicine',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - search Medicine': {
                  summary: '200 - ECOM-V2 - search Medicine',
                  value: require('../sample-data/api/medicine/search/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Search Medicine',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/medicine/search/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/admin/invitation/send': {
      post: {
        tags: ['Admin'],
        summary: 'Invitation send',
        operationId: 'invitationSend',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - Invitation send': {
                  summary: '200 - ECOM-V2 - Invitation send',
                  value: require('../sample-data/api/admin/invitation/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Invitation send',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/admin/invitation/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/doctor/auth/otp/generate': {
      post: {
        tags: ['Doctor'],
        summary: 'generate otp',
        operationId: 'generateOtp',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - generate otp': {
                  summary: '200 - ECOM-V2 - generate otp',
                  value: require('../sample-data/api/doctor/generateOtp/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'generate otp',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/doctor/generateOtp/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
    '/api/doctor/auth/otp/validate': {
      post: {
        tags: ['Doctor'],
        summary: 'Validate otp',
        operationId: 'invitationSend',
        produces: 'application/json',
        consumes: ['application/json'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
              },
              examples: {
                '200 - ECOM-V2 - Validate otp': {
                  summary: '200 - ECOM-V2 - Validate otp',
                  value: require('../sample-data/api/doctor/validateotp/request.json'),
                },
              },
            },
          },
        },
        responses: {
          success: {
            description: 'Validate otp',
            content: {
              'application/json': {
                examples: [
                  {
                    summary: '200 - GATEWAY',
                    value: require('../sample-data/api/doctor/validateotp/success.json'),
                  },
                ],
              },
            },
          },
          error: {
            description: 'Error',
            content: {
              'application/json': {
                examples: errors,
              },
            },
          },
        },
      },
    },
  },

  securityDefinitions: {
    ecomv2_auth: {
      type: 'oauth2',
      flow: 'implicit',
    },
  },
  definitions: {
    ApiResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'integer',
          format: 'int32',
        },
        type: {
          type: 'string',
        },
        message: {
          type: 'string',
        },
        data: {
          type: 'object',
        },
        metadata: {
          type: 'object',
        },
      },
    },
  },
};

module.exports = swagger;
