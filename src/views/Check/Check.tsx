import { Button, Row, Space, Input, Divider, Radio, RadioChangeEvent, Table, Form } from 'antd'
import { useEffect, useState } from 'react'
import { ColumnsType } from 'antd/es/table'
import { Infos } from '../../store/modules/check'
import { useRTK, useSelect } from '../../hooks'
import _ from 'lodash'
import { getApplyAction, postApplyAction, putApplyAction, updateapplyList } from '../../store/modules/check'
import 'dayjs/locale/zh-cn'
import { SearchOutlined } from '@ant-design/icons'

export default function Apply() {
  const { dispatch } = useRTK()
  const user = useSelect('infos')
  const applyList = useSelect('applyList')
  const [typeValue, setTypeValue] = useState('a')

  useEffect(() => {
    if (_.isEmpty(applyList)) {
      dispatch(
        getApplyAction({
          applicantid: user._id,
        }),
      ).then((action) => {
        const { errcode, rets } = action.payload as { errcode: number; rets: Infos[] }
        if (errcode === 0 && rets.length > 0) {
          dispatch(updateapplyList(rets))
        }
      })
    }
  }, [])

  const onSelectType = (e: RadioChangeEvent) => {
    setTypeValue(e.target.value)
  }

  const columns: ColumnsType<Infos> = [
    {
      title: '申请人',
      dataIndex: 'applicantname',
      key: 'applicantname',
    },
    {
      title: '审批事由',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
      render(_) {
        return _.join(' - ')
      },
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: '操作',
      dataIndex: 'approvername',
      key: 'approvername',
    },
    {
      title: '状态',
      dataIndex: 'state',
      key: 'state',
    },
  ]
  const onSearch = (value: string) => {
    console.log('value', value)
  }
  return (
    <>
      <Row justify={'center'}>
        <h2 style={{ color: 'red' }}>懒得写这个页面了，差七不差八</h2>
      </Row>
      {/* <Row justify="end" style={{ marginBottom: '20px' }}>
        <Space>
          <Input.Search
            placeholder="请输入搜索关键词"
            allowClear
            enterButton="搜索"
            size="middle"
            onSearch={(value) => onSearch(value)}
          />
          <Divider type="vertical" style={{ borderLeftColor: '#dcdfe6' }} />
          <Radio.Group defaultValue={typeValue} buttonStyle="solid" size="middle" onChange={(e) => onSelectType(e)}>
            <Radio.Button value="a">全部</Radio.Button>
            <Radio.Button value="b">待审批</Radio.Button>
            <Radio.Button value="c">已通过</Radio.Button>
            <Radio.Button value="d">未通过</Radio.Button>
          </Radio.Group>
        </Space>
      </Row>
      <Table rowKey="_id" dataSource={applyList} columns={columns} bordered size="small" /> */}
    </>
  )
}
