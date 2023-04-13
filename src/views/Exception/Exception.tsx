import { Button, Row, Select, Space, Col, Empty, Timeline, Card } from 'antd'
import './Exception.less'
import { Link } from 'react-router-dom'
import { useRoute, useSelect } from '../../hooks'
import { useEffect, useState } from 'react'
import { getTimeAction, updateInfos } from '../../store/modules/sign'
import _ from 'lodash'
import { useAppDispatch } from '../../store'
import { toZero } from '../../utils/common'
import { Infos, PostApply, getApplyAction, updateapplyList } from '../../store/modules/check'
const date = new Date()

export default function Exception() {
  const { searchParams, setSearchParams } = useRoute()
  const currentMonth = date.getMonth() + 1
  const [month, setMonth] = useState(Number(searchParams.get('month')) || Number(currentMonth))
  const signsInfos = useSelect('signInfos')
  const usersInfos = useSelect('user')
  const applyList = useSelect('applyList')
  const dispatch = useAppDispatch()
  const year = date.getFullYear()
  const monthOptions = []
  for (let i = 1; i <= 12; i++) {
    monthOptions.push(
      <Select.Option value={i} key={i}>
        {i}月
      </Select.Option>,
    )
  }
  useEffect(() => {
    if (_.isEmpty(signsInfos)) {
      dispatch(getTimeAction({ userid: usersInfos._id as string })).then((action) => {
        const { errcode, infos } = action.payload as Login.IndexSign
        if (errcode === 0) {
          dispatch(updateInfos(infos))
        }
      })
    }
  }, [signsInfos, usersInfos, dispatch])

  useEffect(() => {
    if (_.isEmpty(applyList)) {
      dispatch(
        getApplyAction({
          applicantid: usersInfos._id,
        }),
      ).then((action) => {
        const { errcode, rets } = action.payload as { errcode: number; rets: Infos[] }
        if (errcode === 0 && rets.length > 0) {
          dispatch(updateapplyList(rets))
        }
      })
    }
  }, [applyList, usersInfos, dispatch])

  const renderTime = (date: string) => {
    const ret = signsInfos.time[toZero(month + 1)][date]
    if (Array.isArray(ret)) {
      return ret.join('-')
    } else {
      return `暂无打卡记录`
    }
  }

  let details,
    TimelineItem = [] as { children: JSX.Element }[],
    ApplyLineItem = [] as { children: JSX.Element }[]
  if (signsInfos.detail) {
    // 匹配当前月份的考勤详情
    const detailMonth = signsInfos.detail[toZero(month + 1)]
    details = Object.entries(detailMonth)
      .filter((v) => v[1] !== '正常出勤')
      .sort()
    TimelineItem = details.map((item) => {
      return {
        children: (
          <>
            <h4 className="mgb5">
              {year}年{month + 1}月{item[0]}日
            </h4>
            <Card>
              <Space>
                <h4>{item[1] as string}</h4>
                <p>考勤详情：{renderTime(item[0])}</p>
              </Space>
            </Card>
          </>
        ),
      }
    })
  }
  const applyListMonth = applyList.filter((v: PostApply) => {
    const startTime = v.time[0].split(' ')[0].split('-')
    const endTime = v.time[1].split(' ')[0].split('-')
    return startTime[1] <= toZero(month) && endTime[1] >= toZero(month)
  })
  ApplyLineItem = applyListMonth.map((item: any) => {
    return {
      children: (
        <>
          <h4 className="mgb5">{item.reason}</h4>
          <Card>
            <h4 className="mgb5">{item.state}</h4>
            <p className="mgb5">申请日期：{item.time.join('-')}</p>
            <p className="mgb5">申请详情：{item.note}</p>
          </Card>
        </>
      ),
    }
  })
  return (
    <div>
      <Row justify="space-between" align="middle" className="mgb20">
        <Space>
          <Button>{year}年</Button>
          <Select
            value={month}
            onChange={(newMonth) => {
              setMonth(newMonth)
              setSearchParams({ month: String(newMonth) })
            }}>
            {monthOptions}
          </Select>
        </Space>
        <Link to={'/apply'}>
          <Button type="primary">异常处理</Button>
        </Link>
      </Row>
      <Row className="exception" gutter={20}>
        <Col span={12}>{details ? <Timeline items={TimelineItem} /> : <Empty description="暂无异常考勤" />}</Col>
        <Col span={12}>
          {ApplyLineItem.length ? <Timeline items={ApplyLineItem} /> : <Empty description="暂无申请审批" />}
        </Col>
      </Row>
    </div>
  )
}
