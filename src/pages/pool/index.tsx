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
const Coin: React.FC = () => (
  <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.9448 26H11.0623C4.95042 26 0 20.1783 0 13C0 5.82174 4.95043 0 11.0552 0H13.9377C20.0496 0 25 5.82174 25 13C25 20.1783 20.0496 26 13.9448 26Z" fill="#E5B800"/>
    <path d="M10.8003 26C16.7651 26 21.6006 20.1797 21.6006 13C21.6006 5.8203 16.7651 0 10.8003 0C4.83545 0 0 5.8203 0 13C0 20.1797 4.83545 26 10.8003 26Z" fill="#FDDD48"/>
    <path d="M10.5241 23.1741C15.3117 23.1741 19.1927 18.6191 19.1927 13.0002C19.1927 7.38133 15.3117 2.82631 10.5241 2.82631C5.73664 2.82631 1.85559 7.38133 1.85559 13.0002C1.85559 18.6191 5.73664 23.1741 10.5241 23.1741Z" fill="#FFCC00"/>
    <path d="M5.04956 11.8912C5.21953 14.7879 7.74785 18.151 11.3173 18.3347C13.0028 18.4195 14.3555 17.5716 14.9362 16.0173C15.0354 15.7559 15.0566 15.4945 15.0141 15.226C14.9433 14.7526 14.5326 14.3499 14.0935 14.3075C13.619 14.258 13.5056 14.364 13.2365 14.9787C12.8328 15.876 12.1388 16.3988 11.1331 16.4271C9.0793 16.4907 6.99006 14.5477 6.88383 12.4847C6.86259 12.0184 6.78468 11.5803 6.40933 11.2624C6.12604 11.0222 5.77902 10.9021 5.42491 11.0646C5.0708 11.2129 5.02831 11.545 5.04956 11.8912Z" fill="#F9F9FA"/>
    <path d="M12.9108 11.7004C12.9108 12.3363 13.4136 12.8662 14.0085 12.8591C14.398 12.8521 14.6601 12.5906 14.6601 12.1879C14.6671 11.6015 14.0722 10.9515 13.534 10.9586C13.1445 10.9656 12.9108 11.2412 12.9108 11.7004Z" fill="#F9F9FA"/>
  </svg>
)
const Ray: React.FC = () => (
<svg width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M26.8625 12.281V23.6914L14.1709 31.0175L1.47231 23.6914V9.03203L14.1709 1.69881L23.925 7.33322L25.3973 6.48381L14.1709 0L0 8.18262V24.5408L14.1709 32.7234L28.3419 24.5408V11.4316L26.8625 12.281Z" fill="url(#paint0_linear)"/>
<path d="M10.6175 23.6985H8.49402V16.5776H15.5724C16.2421 16.5702 16.8819 16.2994 17.3535 15.8238C17.8251 15.3483 18.0905 14.7062 18.0923 14.0364C18.0961 13.7053 18.0322 13.3768 17.9044 13.0713C17.7765 12.7657 17.5876 12.4896 17.349 12.2598C17.1182 12.0226 16.8419 11.8345 16.5366 11.7068C16.2313 11.579 15.9033 11.5143 15.5724 11.5165H8.49402V9.35059H15.5794C16.8199 9.35802 18.0075 9.8541 18.8847 10.7312C19.7618 11.6084 20.2579 12.796 20.2653 14.0364C20.2729 14.986 19.9834 15.9141 19.4372 16.6908C18.9345 17.434 18.2261 18.0145 17.3986 18.3613C16.5792 18.6212 15.7241 18.7502 14.8645 18.7436H10.6175V23.6985Z" fill="url(#paint1_linear)"/>
<path d="M20.2159 23.5215H17.7384L15.8273 20.1876C16.5834 20.1413 17.3292 19.9888 18.0428 19.7346L20.2159 23.5215Z" fill="url(#paint2_linear)"/>
<path d="M25.3831 9.90979L26.8483 10.7238L28.3136 9.90979V8.18974L26.8483 7.34033L25.3831 8.18974V9.90979Z" fill="url(#paint3_linear)"/>
<defs>
<linearGradient id="paint0_linear" x1="28.3168" y1="8.19162" x2="-1.73336" y2="20.2086" gradientUnits="userSpaceOnUse">
<stop stop-color="#C200FB"/>
<stop offset="0.489658" stop-color="#3772FF"/>
<stop offset="0.489758" stop-color="#3773FE"/>
<stop offset="1" stop-color="#5AC4BE"/>
</linearGradient>
<linearGradient id="paint1_linear" x1="28.3167" y1="8.19166" x2="-1.73341" y2="20.2086" gradientUnits="userSpaceOnUse">
<stop stop-color="#C200FB"/>
<stop offset="0.489658" stop-color="#3772FF"/>
<stop offset="0.489758" stop-color="#3773FE"/>
<stop offset="1" stop-color="#5AC4BE"/>
</linearGradient>
<linearGradient id="paint2_linear" x1="28.3168" y1="8.19164" x2="-1.73339" y2="20.2086" gradientUnits="userSpaceOnUse">
<stop stop-color="#C200FB"/>
<stop offset="0.489658" stop-color="#3772FF"/>
<stop offset="0.489758" stop-color="#3773FE"/>
<stop offset="1" stop-color="#5AC4BE"/>
</linearGradient>
<linearGradient id="paint3_linear" x1="28.3168" y1="8.19166" x2="-1.7334" y2="20.2086" gradientUnits="userSpaceOnUse">
<stop stop-color="#C200FB"/>
<stop offset="0.489658" stop-color="#3772FF"/>
<stop offset="0.489758" stop-color="#3773FE"/>
<stop offset="1" stop-color="#5AC4BE"/>
</linearGradient>
</defs>
</svg>
)

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

          <Row gutter={20} className="compounding-container">
            <Col span={24} style={{ marginBottom: 20 }}>
              <Card
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(#1C1C28 ,#1C1C28) padding-box, linear-gradient(to right, #00CFDE, #05A660) border-box',
                  borderRadius: 16
                }}
              >
                <Row className="compounding-info goriant">
                  <Col span={2} className="logo-container">
                    <Coin /><span className="text-yellow-1">RIANT</span>
                  </Col>
                  <Col span={8} className="apy-container text-green-light">
                    <div className="percent">131.63%</div>
                    <div className="text">Auto-Compounding</div>
                  </Col>
                  <Col span={5} className="total-container">
                    <div className="text">Total Stake</div>
                    <div className="number">248,007,819.70</div>
                  </Col>
                  <Col span={5} className="staked-container">
                    <div className="text">Staked</div>
                    <div className="number">42.00</div>
                  </Col>
                  <Col className="detail-button" span={2}>
                    <div>
                      Detail ^
                    </div>
                  </Col>
                </Row>
                <Row className="feature-container">
                  <Col span={5}>
                    Test
                  </Col>
                  <Col className="staked-container" span={4}>
                    <div className="text">STAKED</div>
                    <div className="number">20.195</div>
                  </Col>
                  <Col className="withdraw-deposit-container" span={11}>
                    <div>
                      <span className="text">WITHRAW</span>
                      <span className="dash">|</span>
                      <span className="text text-gradient-4">DEPOSIT</span>
                    </div>
                    <div>
                      <Col span={5}>
                        Test
                      </Col>
                      <Col span={2}>
                        Test
                      </Col>
                    </div>
                    <div></div>
                  </Col>
                </Row>
              </Card>{' '}
            </Col>
            <Col span={24}>
              <Card
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(#1C1C28,#1C1C28) padding-box, linear-gradient(to right, #00CFDE, #05A660) border-box',
                  borderRadius: 16
                }}
              >
                <Row className="ray">
                  <Col span={2} className="logo-container">
                    <Ray /><span className="">RAY</span>
                  </Col>
                  <Col span={8} className="apy-container text-green-light">
                    <div className="percent">131.63%</div>
                    <div className="text">Auto-Compounding</div>
                  </Col>
                  <Col span={5} className="total-container">
                    <div className="text">Total Stake</div>
                    <div className="number">248,007,819.70</div>
                  </Col>
                  <Col span={5} className="staked-container">
                    <div className="text">Staked</div>
                    <div className="number">42.00</div>
                  </Col>
                  <Col className="detail-button" span={2}>
                    <div>
                      Detail v
                    </div>
                  </Col>
                </Row>
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
