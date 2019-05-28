export default {
  apihost: 'http://47.92.200.142:8030',
  imghost:  'http://47.92.200.142:8030/api/Home/Image?fileId=',
  timeout: 25000,
  // 登录页地址
  loginurl: '/account/login',
  // 免授权的url，不用登录即可访问
  exemptionAuthUrls: [
    '/account/regist',
    '/account/forgetpsd',

  ],
  leftmenu:[
    {
      content: '首页',
      name: '1',
      icon: 'ios-home-outline',
      show: true,
      children: [
        {
          content: '首页',
          name: '/projectmanagement/project/home',
          icon: '',
          show: true,
        }
      ]
    },
    {
      content: '项目信息',
      name: '2',
      icon: 'ios-cube-outline',
      show: true,
      children: [
        {
          content: '基本信息',
          name: '/projectmanagement/project/bascinfo',
          icon: '',
          show: true,
        },
        {
          content: '计划管理',
          name: '/projectmanagement/project/planmanage',
          icon: '',
          show: true,
        }
      ]
    },
    {
      content: '进度管理',
      name: '3',
      icon: 'ios-clock-outline',
      show: true,
      children: [
        {
          content: '进度管理',
          name: '/projectmanagement/project/progressmanage',
          icon: '',
          show: true,
        },
        {
          content: '进度汇总',
          name: '/projectmanagement/project/progresssummary',
          icon: '',
          show: true,
        }
      ]
    },
    {
      content: '桩位复测',
      name: '4',
      icon: 'ios-link-outline',
      show: true,
      children: [
        {
          content: '桩位复测',
          name: '/projectmanagement/project/positionreset',
          icon: '',
          show: true,
        }
      ]
    },
    {
      content: '施工日志',
      name: '5',
      icon: 'ios-home-outline',
      show: false,
      children: [
        {
          content: '日志',
          name: '/projectmanagement/log/daily',
          icon: '',
          show: true,
        },
        {
          content: '周报',
          name: '/projectmanagement/log/weekly',
          icon: '',
          show: true,
        },
        {
          content: '月报',
          name: '/projectmanagement/log/monthly',
          icon: '',
          show: true,
        },
      ]
    },
    {
      content: '系统管理',
      name: '6',
      icon: 'ios-home-outline',
      show: false,
      children: [
        {
          content: '部门管理',
          name: '/system/departmentManagement',
          icon: '',
          show: true,
        },
        {
          content: '人员管理',
          name: '/system/personManagement',
          icon: '',
          show: true,
        },
        {
          content: '权限分配',
          name: '/system/permissionManagement',
          icon: '',
          show: true,
        },
      ]
    },
  ],
  permissionTree:[
    {
        title: '首页',
        code: 1,
        expand: false,
        root:true,
        children: [
            {
                title: '首页',
                code: 7,
                expand: false,
                root:false,
                children: [
                    {
                        code: 1,
                        root:false,
                        title: '增'
                    },
                    {
                        code: 2,
                        root:false,
                        title: '删'
                    },
                    {
                        code: 3,
                        root:false,
                        title: '改'
                    },
                    {
                        code: 4,
                        root:false,
                        title: '查'
                    }
                ]
            }
        ]
    },
    {
        title: '项目信息',
        code: 2,
        expand: false,
        root:true,
        children: [
            {
                title: '基本信息',
                code: 8,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            },
            {
                title: '计划管理',
                code: 9,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            }
        ]
    },
    {
        title: '进度管理',
        code: 3,
        expand: false,
        root:true,
        children: [
            {
                title: '进度管理',
                code: 10,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            },
            {
                title: '进度汇总',
                code: 11,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            }
        ]
    },
    {
        title: '桩位复测',
        code: 4,
        expand: false,
        root:true,
        children: [
            {
                title: '桩位复测',
                code: 12,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            }
        ]
    },
    {
        title: '施工日志',
        code: 5,
        expand: false,
        root:true,
        children: [
            {
                title: '日志',
                code: 13,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            },
            {
                title: '周报',
                code: 14,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            },
            {
                title: '月报',
                code: 15,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            }
        ]
    },
    {
        title: '系统管理',
        code: 6,
        expand: false,
        root:true,
        children: [
            {
                title: '部门管理',
                code: 16,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            },
            {
                title: '人员管理',
                code: 17,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            },
            {
                title: '权限分配',
                code: 18,
                expand: false,
                root:false,
                children: [
                  {
                      code: 1,
                      root:false,
                      title: '增'
                  },
                  {
                      code: 2,
                      root:false,
                      title: '删'
                  },
                  {
                      code: 3,
                      root:false,
                      title: '改'
                  },
                  {
                      code: 4,
                      root:false,
                      title: '查'
                  }
                ]
            }
        ]
    }    
  ]

}
