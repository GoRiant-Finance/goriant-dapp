import * as React from 'react'
import { Space, Card } from 'antd'

import Page from '../../components/layout/Page'
import Container from '../../components/layout/Container'
import styled from '../../utils/styled'
import "./../../core.less"
import "./../../pool.less"
import { Row, Col } from 'antd'

const style = { background: '#0092ff', padding: '8px 0' }
const dark1 = '#28293D'

function PoolPage() {
  return (
    <Page>
      <Container>
        <PageContent>
          <Row gutter={20} style={{ marginBottom: 30 }}>
            <Col xs={24} sm={10}>
              <Row gutter={50}>
                <Col span={24}>
                  <Card bordered={false} style={{ background: dark1, borderRadius: 16, marginBottom: 20 }}>
                    <CardTitle>Total Value Locked</CardTitle>
                    <CardNumber>$1,232,323,323.00</CardNumber>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card bordered={false} style={{ background: dark1, borderRadius: 16 }}>
                    <CardTitle>Total User Earned</CardTitle>
                    <CardNumber>32,323,323.00</CardNumber>
                  </Card>{' '}
                </Col>
              </Row>{' '}
            </Col>

            <Col xs={24} sm={14}>
              <Card className="farmsPanel" bordered={false} style={{ background: dark1, borderRadius: 16, height: '100%'}}>
                <CardTitle>Farms & Staking</CardTitle>
                <Row gutter={16} style={{verticalAlign: 'text-bottom', position: 'relative'}}>
                  <Col span={14}>
                    <CardDashed className="farmsContainer">
                      <div className="harvest">
                        <div className="info">
                          <h1>GORIANT to Harvest</h1>
                          <span className="goriant text-yellow-1">0.126</span>
                          <span className="text-red">-$5.18%</span>
                        </div>
                      </div>
                      <div className="wallet">
                        <div className="info">
                          <h1>GORIANT to Wallet</h1>
                          <span className="goriant text-yellow-1">2.126</span>
                          <span className="text-green">+2.18%</span>
                         </div>
                      </div>
                    </CardDashed>
                  </Col>
                  <Col span={8}>
                    <div className="button">
                        Harvest all (2)
                    </div>
                  </Col>
                </Row>{' '}
              </Card>{' '}
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={24} style={{ marginBottom: 20 }}>
              <Card
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(#28293D,#28293D) padding-box, linear-gradient(to right, #00CFDE, #05A660) border-box',
                  borderRadius: 16
                }}
              >
                <p>Card content</p>
              </Card>{' '}
            </Col>
            <Col span={24}>
              <Card
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(#28293D,#28293D) padding-box, linear-gradient(to right, #00CFDE, #05A660) border-box',
                  borderRadius: 16
                }}
              >
                <p>Card content</p>
              </Card>{' '}
            </Col>
          </Row>
        </PageContent>
      </Container>
    </Page>
  )
}

export default PoolPage

const PageContent = styled('article')`
  max-width: ${props => props.theme.widths.lg};
  margin: 0 auto;
  line-height: 1.6;

  a {
    color: ${props => props.theme.colors.brand};
  }

  h1,
  h2,
  h3,
  h4 {
    margin-bottom: 0.5rem;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
      Helvetica Neue, Arial, sans-serif;
    line-height: 1.25;
  }
`

const CardTitle = styled('p')`
  font-weight: bold;
  font-size: 12px;
  line-height: 17px;
  /* identical to box height */
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #fafafc;
`
const CardNumber = styled('p')`
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  padding-top: 12px;
  line-height: 44px;
  /* or 137% */
  color: #06c270;
  text-shadow: 4px 0px 40px  #57EBA1;
`
const CardDashed = styled('div')`
  border: 2px dashed  RGBA(206,207,217,0.5);
  border-radius: 16px;
`
