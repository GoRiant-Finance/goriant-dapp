import { Card, Col, Input, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useWallet } from '../../contexts/wallet'
import { useConnection } from '../../contexts/connection'

import Page from '../../components/layout/Page'

import Container from '../../components/layout/Container'
import styled from '../../utils/styled'
import '../../core.less'
import '../../pool.less'

import LoadingOverlay from '../../components/data/LoadingOverlay'
import LoadingOverlayInner from '../../components/data/LoadingOverlayInner'
import LoadingSpinner from '../../components/data/LoadingSpinner'
import { formatUSD, formatNumber } from '../../utils/utils'
import StakingClient from '../../solana/StakingClient'

export const PoolPage = (props: { left?: JSX.Element; right?: JSX.Element }) => {
  const { wallet, connected, isUserRiant, setUserRiant, select } = useWallet()
  const connection = useConnection()
  const [loading, setLoading] = useState(true)

  const [showRiant, setShowRiant] = useState(false)
  const [showRay, setShowRay] = useState(false)
  const [coinTypes] = useState(['withdraw', 'deposit'])
  const [riantPick, setRiantPick] = useState('deposit')
  const [totalStakedRiant, setTotalStakedRiant] = useState(0)
  const [balanceSol] = useState(0)
  const [riantStaked, setRiantStaked] = useState(0)
  const [riantBalance, setRiantBalance] = useState(0)
  const [pendingReward, setPendingReward] = useState(0)
  const [riantNumber, setRiantNumber] = useState('')
  const [riantProcessing, setRiantProcessing] = useState(false)

  useEffect(() => {
    async function fetchMyAPI() {
      const info = await StakingClient.getStakingPoolInfo(connection, wallet as any)
      setTotalStakedRiant(info.totalStaked)
      if (wallet && wallet.publicKey) {
        const isExist = await StakingClient.checkMemberExist(connection, wallet as any)
        setUserRiant(isExist as boolean)
        if (isUserRiant) {
          const memberRiantBalances = await StakingClient.getMemberRiantBalances(connection, wallet as any)
          setShowRiant(true)
          setRiantBalance(memberRiantBalances.riantBalance)
          setRiantStaked(memberRiantBalances.stakedAmount)
          setPendingReward(memberRiantBalances.pendingRewardAmount)
        } else {
          setShowRiant(false)
        }
      }

    }
    setInterval(() => {
      setLoading(false)
    }, 2000)
    fetchMyAPI()
  }, [wallet, connected, isUserRiant, riantProcessing])

  const dark1 = '#28293D'

  const PoolPage = <div>{/* <Pool wallet={wallet} connection={connection} />: */}</div>
  const handlePickRadio = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRiantPick(e.target.value)
  }

  const handleRianNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const data = event.target.value
    setRiantNumber(data)
  }

  const options = coinTypes.map((loan, key) => {
    const isCurrent = riantPick === loan
    return (
      <span key={key} className="radioPad">
        <label className={isCurrent ? 'text text-gradient-4' : 'text'}>
          <input className="text" type="radio" name="riantTypes" id={loan} value={loan} onChange={handlePickRadio} />
          {loan}
        </label>
      </span>
    )
  })

  const hideComponent = (name: string) => {
    switch (name) {
      case 'showRiant':
        setShowRiant(!showRiant)
        break
      case 'showRay':
        setShowRay(!showRay)
        break
      default:
    }
  }

  const actionRiant = async () => {
    if (riantPick === 'deposit') {
      await StakingClient.deposit(connection, wallet as any, riantNumber as any, setRiantProcessing)
      setRiantNumber('0')
    } else if (riantPick === 'withdraw') {
      await StakingClient.withdraw(connection, wallet as any, riantNumber as any, setRiantProcessing as any)
      setRiantNumber('0')
    }
  }
  const createMember = async () => {
    await StakingClient.createMember(connection, wallet as any, setUserRiant)
  }

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
    @media (max-width: ${props => props.theme.breakpoints.sm}) {
      font-size: 24px;
    }

    @media (max-width: ${props => props.theme.breakpoints.lg}) {
      font-size: 22px;
    }

    /* or 137% */
    color: #06c270;
    text-shadow: 4px 0px 40px #57eba1;
  `
  const CardDashed = styled('div')`
    border: 2px dashed RGBA(206, 207, 217, 0.5);
    border-radius: 16px;
  `
  const Coin: React.FC = () => (
    <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.9448 26H11.0623C4.95042 26 0 20.1783 0 13C0 5.82174 4.95043 0 11.0552 0H13.9377C20.0496 0 25 5.82174 25 13C25 20.1783 20.0496 26 13.9448 26Z"
        fill="#E5B800"
      />
      <path
        d="M10.8003 26C16.7651 26 21.6006 20.1797 21.6006 13C21.6006 5.8203 16.7651 0 10.8003 0C4.83545 0 0 5.8203 0 13C0 20.1797 4.83545 26 10.8003 26Z"
        fill="#FDDD48"
      />
      <path
        d="M10.5241 23.1741C15.3117 23.1741 19.1927 18.6191 19.1927 13.0002C19.1927 7.38133 15.3117 2.82631 10.5241 2.82631C5.73664 2.82631 1.85559 7.38133 1.85559 13.0002C1.85559 18.6191 5.73664 23.1741 10.5241 23.1741Z"
        fill="#FFCC00"
      />
      <path
        d="M5.04956 11.8912C5.21953 14.7879 7.74785 18.151 11.3173 18.3347C13.0028 18.4195 14.3555 17.5716 14.9362 16.0173C15.0354 15.7559 15.0566 15.4945 15.0141 15.226C14.9433 14.7526 14.5326 14.3499 14.0935 14.3075C13.619 14.258 13.5056 14.364 13.2365 14.9787C12.8328 15.876 12.1388 16.3988 11.1331 16.4271C9.0793 16.4907 6.99006 14.5477 6.88383 12.4847C6.86259 12.0184 6.78468 11.5803 6.40933 11.2624C6.12604 11.0222 5.77902 10.9021 5.42491 11.0646C5.0708 11.2129 5.02831 11.545 5.04956 11.8912Z"
        fill="#F9F9FA"
      />
      <path
        d="M12.9108 11.7004C12.9108 12.3363 13.4136 12.8662 14.0085 12.8591C14.398 12.8521 14.6601 12.5906 14.6601 12.1879C14.6671 11.6015 14.0722 10.9515 13.534 10.9586C13.1445 10.9656 12.9108 11.2412 12.9108 11.7004Z"
        fill="#F9F9FA"
      />
    </svg>
  )
  const Ray: React.FC = () => (
    <svg width="29" height="32" viewBox="0 0 29 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26.8625 12.281V23.6914L14.1709 31.0175L1.47231 23.6914V9.03203L14.1709 1.69881L23.925 7.33322L25.3973 6.48381L14.1709 0L0 8.18262V24.5408L14.1709 32.7234L28.3419 24.5408V11.4316L26.8625 12.281Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M10.6175 23.6985H8.49402V16.5776H15.5724C16.2421 16.5702 16.8819 16.2994 17.3535 15.8238C17.8251 15.3483 18.0905 14.7062 18.0923 14.0364C18.0961 13.7053 18.0322 13.3768 17.9044 13.0713C17.7765 12.7657 17.5876 12.4896 17.349 12.2598C17.1182 12.0226 16.8419 11.8345 16.5366 11.7068C16.2313 11.579 15.9033 11.5143 15.5724 11.5165H8.49402V9.35059H15.5794C16.8199 9.35802 18.0075 9.8541 18.8847 10.7312C19.7618 11.6084 20.2579 12.796 20.2653 14.0364C20.2729 14.986 19.9834 15.9141 19.4372 16.6908C18.9345 17.434 18.2261 18.0145 17.3986 18.3613C16.5792 18.6212 15.7241 18.7502 14.8645 18.7436H10.6175V23.6985Z"
        fill="url(#paint1_linear)"
      />
      <path
        d="M20.2159 23.5215H17.7384L15.8273 20.1876C16.5834 20.1413 17.3292 19.9888 18.0428 19.7346L20.2159 23.5215Z"
        fill="url(#paint2_linear)"
      />
      <path
        d="M25.3831 9.90979L26.8483 10.7238L28.3136 9.90979V8.18974L26.8483 7.34033L25.3831 8.18974V9.90979Z"
        fill="url(#paint3_linear)"
      />
      <defs>
        <linearGradient id="paint0_linear" x1="28.3168" y1="8.19162" x2="-1.73336" y2="20.2086" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C200FB" />
          <stop offset="0.489658" stopColor="#3772FF" />
          <stop offset="0.489758" stopColor="#3773FE" />
          <stop offset="1" stopColor="#5AC4BE" />
        </linearGradient>
        <linearGradient id="paint1_linear" x1="28.3167" y1="8.19166" x2="-1.73341" y2="20.2086" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C200FB" />
          <stop offset="0.489658" stopColor="#3772FF" />
          <stop offset="0.489758" stopColor="#3773FE" />
          <stop offset="1" stopColor="#5AC4BE" />
        </linearGradient>
        <linearGradient id="paint2_linear" x1="28.3168" y1="8.19164" x2="-1.73339" y2="20.2086" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C200FB" />
          <stop offset="0.489658" stopColor="#3772FF" />
          <stop offset="0.489758" stopColor="#3773FE" />
          <stop offset="1" stopColor="#5AC4BE" />
        </linearGradient>
        <linearGradient id="paint3_linear" x1="28.3168" y1="8.19166" x2="-1.7334" y2="20.2086" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C200FB" />
          <stop offset="0.489658" stopColor="#3772FF" />
          <stop offset="0.489758" stopColor="#3773FE" />
          <stop offset="1" stopColor="#5AC4BE" />
        </linearGradient>
      </defs>
    </svg>
  )

  const Info: React.FC = () => (
    <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.52942 11.43C3.52942 15.33 6.51419 18.4917 10.1961 18.4917C13.878 18.4917 16.8628 15.33 16.8628 11.43C16.8628 7.52987 13.878 4.36823 10.1961 4.36823C6.51419 4.36823 3.52942 7.52987 3.52942 11.43ZM4.36278 11.4299C4.36278 14.8425 6.97445 17.609 10.1961 17.609C13.4178 17.609 16.0294 14.8425 16.0294 11.4299C16.0294 8.01736 13.4178 5.25093 10.1961 5.25093C6.97445 5.25093 4.36278 8.01736 4.36278 11.4299ZM9.03639 15.0832V15.8436H12.0157V15.0832L11.0872 14.9143V9.31456H9.03639V10.0809L9.96494 10.2499V14.9143L9.03639 15.0832ZM11.0872 6.43018V7.64305H9.96496V6.43018H11.0872Z"
        fill="#FAFAFC"
      />
    </svg>
  )

  const AutoIcon: React.FC = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.7945 4.42328L12.1248 0.941465C12.1058 0.843352 12.0342 0.763347 11.9385 0.734156C11.8431 0.704425 11.7388 0.730643 11.6682 0.801457L10.4493 2.02072C8.09642 -0.131839 4.43162 -0.0691326 2.155 2.20748C1.07494 3.28754 0.451394 4.72303 0.40031 6.2496C0.395174 6.3988 0.511938 6.52394 0.661405 6.52881C0.664379 6.52881 0.667352 6.52881 0.670595 6.52881C0.815468 6.52881 0.935475 6.41367 0.94034 6.26771C0.98737 4.87872 1.55443 3.57243 2.53719 2.58967C4.66758 0.459816 8.13237 0.460357 10.2622 2.58967C10.3636 2.69102 10.543 2.69102 10.6444 2.58967L11.6899 1.54393L12.1883 4.13354L9.59867 3.6354L9.95112 3.28295C10.0568 3.17727 10.0568 3.00645 9.95112 2.90077C9.84544 2.79508 9.67462 2.79508 9.56894 2.90077L8.85619 3.61351C8.78538 3.68432 8.7597 3.78811 8.78889 3.88379C8.81808 3.97948 8.89782 4.0511 8.99647 4.06975L12.4783 4.73952C12.5661 4.75628 12.6569 4.72871 12.7205 4.66519C12.7834 4.60194 12.8116 4.51113 12.7945 4.42328Z"
        fill="url(#paint0_radial)"
      />
      <path
        d="M12.1377 6.37527C12.1348 6.375 12.1318 6.375 12.1285 6.375C11.9837 6.375 11.8637 6.49014 11.8588 6.6361C11.812 8.02509 11.245 9.33111 10.2622 10.3141C8.1321 12.444 4.66731 12.4435 2.53719 10.3141C2.43584 10.2128 2.25637 10.2128 2.15501 10.3141L1.10954 11.3599L0.611138 8.77027L3.20074 9.26841L2.84829 9.62059C2.74261 9.726 2.74261 9.89709 2.84829 10.0028C2.95397 10.1085 3.12479 10.1085 3.23047 10.0028L3.94322 9.2903C4.01403 9.21949 4.03971 9.1157 4.01052 9.02002C3.98133 8.92433 3.90159 8.85271 3.80294 8.83406L0.321392 8.16429C0.233278 8.14726 0.142733 8.17537 0.0792156 8.23862C0.0159688 8.30187 -0.0121409 8.39268 0.00488711 8.4808L0.674655 11.9626C0.693575 12.0607 0.7652 12.1407 0.860882 12.1699C0.956292 12.1994 1.06035 12.1732 1.13117 12.1026L2.35015 10.8834C3.49319 11.9291 4.94652 12.4518 6.3993 12.4518C7.93669 12.4518 9.4738 11.8667 10.6441 10.6963C11.7245 9.61599 12.3477 8.18051 12.3986 6.65421C12.404 6.50528 12.2872 6.38014 12.1377 6.37527Z"
        fill="url(#paint1_radial)"
      />
      <defs>
        <radialGradient
          id="paint0_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(11.3963 1.41863) rotate(156.038) scale(4.28479 6.55686)"
        >
          <stop stopColor="#FFDB00" />
          <stop offset="1" stopColor="#FFB800" />
        </radialGradient>
        <radialGradient
          id="paint1_radial"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(10.9957 7.34176) rotate(156.038) scale(4.28462 6.55669)"
        >
          <stop stopColor="#FFDB00" />
          <stop offset="1" stopColor="#FFB800" />
        </radialGradient>
      </defs>
    </svg>
  )

  const ArrowLeftIcon: React.FC = () => (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4.66667 5.42596L2.66667 7.01485H10H2.66667L4.66667 8.60375" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.66671 9.66302V11.2519H13.3334V2.77783H6.66671V4.36672" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
  return (
    <Page>
      <Container>
        {loading && (
          <LoadingOverlay>
            <LoadingOverlayInner>
              <LoadingSpinner />
            </LoadingOverlayInner>
          </LoadingOverlay>
        )}
        <Row gutter={20} style={{ marginBottom: 30 }}>
          <Col xs={24} sm={10}>
            <Row gutter={50}>
              <Col span={24}>
                <Card bordered={false} style={{ background: dark1, borderRadius: 16, marginBottom: 20 }}>
                  <CardTitle>Total Value Locked</CardTitle>
                  <CardNumber>{formatUSD.format(balanceSol)}</CardNumber>
                </Card>
              </Col>
              <Col span={24}>
                <Card bordered={false} style={{ background: dark1, borderRadius: 16 }}>
                  <CardTitle>Total User Earned</CardTitle>
                  <CardNumber>{formatUSD.format(432423434)}</CardNumber>
                </Card>{' '}
              </Col>
            </Row>{' '}
          </Col>

          <Col xs={24} sm={14}>
            <Card className="farmsPanel" bordered={false} style={{ background: dark1, borderRadius: 16, height: '100%' }}>
              <CardTitle>Farms & Staking</CardTitle>
              <Row gutter={16} style={{ verticalAlign: 'text-bottom', position: 'relative' }}>
                <Col xs={24} sm={14}>
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
                <Col xs={24} sm={8}>
                  <div className="button">Harvest all (2)</div>
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
                <Col sm={2} xs={8} md={4} className="logo-container">
                  <Coin />
                  <span className="text-yellow-1">RIANT</span>
                </Col>
                <Col sm={8} xs={16} md={6} className="apy-container text-green-light">
                  <div className="percent">131.63%</div>
                  <div className="text">Auto-Compounding</div>
                </Col>
                <Col sm={5} xs={24} md={5} className="total-container">
                  <div className="text">Total Stake</div>
                  <div className="number">{formatNumber.format(totalStakedRiant)}</div>
                </Col>
                <Col sm={5} xs={24} md={5} className="staked-container">
                  <div className="text">Staked</div>
                  <div className="number">{formatNumber.format(riantStaked)}</div>
                </Col>

                <Col sm={4} xs={24} md={4} className="detail-button">
                  {!connected ? (
                    <div className="connect" onClick={() => select()}>
                      Connect Wallet
                    </div>
                  ) : (
                    [
                      !isUserRiant ? (
                        <div className="button" onClick={() => createMember()}>
                          Enable
                        </div>
                      ) : (
                        <a onClick={() => hideComponent('showRiant')}>Detail</a>
                      )
                    ]
                  )}
                </Col>
              </Row>
              {showRiant && (
                <Row className="feature-container">
                  <Col span={5}>
                    <div className="contract-info">
                      <div className="set-pair-info">
                        <ArrowLeftIcon /> Set Pair Info
                      </div>
                      <div className="view-contract">
                        <ArrowLeftIcon />
                        View Contract
                      </div>
                      <Row className="auto">
                        <div className="button">
                          <AutoIcon /> <span className="text">AUTO</span>
                        </div>
                        <Info />
                      </Row>
                    </div>
                  </Col>
                  <Col className="staked-container" span={4}>
                    <div className="text">PENDING REWARD</div>
                    <div className="number">{formatNumber.format(pendingReward)}</div>
                  </Col>
                  <Col className="withdraw-deposit-container" sm={11} xs={24}>
                    <div>{options}</div>
                    <Row className="stake-amount">
                      <Col sm={18} xs={24} className="number-container">
                        <Row>
                          <Col className="number" sm={17} xs={15}>
                            <Input
                              className="number"
                              placeholder="0"
                              name="riantAmout"
                              type="number"
                              value={riantNumber}
                              onChange={handleRianNumberChange}
                            />
                          </Col>
                          <Col className="text" sm={3} xs={6}>
                            <span>RIANT</span>
                          </Col>
                          <Col className="max-button" span={3}>
                            <div className="button">MAX</div>
                          </Col>
                        </Row>
                      </Col>
                      <Col className="deposit-button-container" sm={6} xs={24}>
                        <button disabled={riantProcessing} onClick={() => actionRiant()} className="deposit-button">
                          {riantProcessing && <FontAwesomeIcon className="icon-button" icon={faCircleNotch} size="lg" spin />}
                          {riantPick}
                        </button>
                      </Col>
                    </Row>
                    <div className="wallet-balance">WALLET BALANCE: {formatNumber.format(riantBalance)} RIANT</div>
                  </Col>
                </Row>
              )}
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
              <Row className="compounding-info ray">
                <Col sm={2} xs={8} md={4} className="logo-container">
                  <Ray />
                  <span className="">RAY</span>
                </Col>
                <Col sm={8} xs={16} md={6} className="apy-container text-green-light">
                  <div className="percent">131.63%</div>
                  <div className="text">Auto-Compounding</div>
                </Col>
                <Col sm={5} xs={24} md={6} className="total-container">
                  <div className="text">Total Stake</div>
                  <div className="number">248,007,819.70</div>
                </Col>
                <Col sm={5} xs={24} md={4} className="staked-container">
                  <div className="text">Staked</div>
                  <div className="number">42.00</div>
                </Col>
                <Col sm={2} xs={24} md={2} className="detail-button" span={2}>
                  <a onClick={() => hideComponent('showRay')}>Detail</a>
                </Col>
              </Row>
              {showRay && (
                <Row className="feature-container">
                  <Col span={5}>
                    <div className="contract-info">
                      <div className="set-pair-info">
                        <ArrowLeftIcon /> Set Pair Info
                      </div>
                      <div className="view-contract">
                        <ArrowLeftIcon />
                        View Contract
                      </div>
                      <Row className="auto">
                        <div className="button">
                          <AutoIcon /> <span className="text">AUTO</span>
                        </div>
                        <Info />
                      </Row>
                    </div>
                  </Col>
                  <Col className="staked-container" span={4}>
                    <div className="text">STAKED</div>
                    <div className="number">20.195</div>
                  </Col>
                  <Col className="withdraw-deposit-container" sm={11} xs={24}>
                    <div>{options}</div>
                    <Row className="stake-amount">
                      <Col sm={18} xs={24} className="number-container">
                        <Row>
                          <Col className="number" sm={17} xs={15}>
                            0
                          </Col>
                          <Col className="text" sm={3} xs={6}>
                            <span>RAY</span>
                          </Col>
                          <Col className="max-button" span={3}>
                            <div className="button">MAX</div>
                          </Col>
                        </Row>
                      </Col>
                      <Col className="deposit-button-container" sm={6} xs={24}>
                        <div className="deposit-button"> {riantPick}</div>
                      </Col>
                    </Row>
                    <div className="wallet-balance">WALLET BALANCE: 0.000 RIANT</div>
                  </Col>
                </Row>
              )}
            </Card>{' '}
          </Col>
        </Row>
      </Container>
    </Page>
  )
}
