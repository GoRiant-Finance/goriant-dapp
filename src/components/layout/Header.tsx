import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from '../../utils/styled'
import Container from './Container'
import { ConnectStatus } from '../connectStatus'
import './../../ant-custom.less'
import { Menu } from 'antd';
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom';

const Wrapper = styled('header')`
  padding: 1.5rem 1.5rem;
  background-color: ${props => props.theme.colors.brand};
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.fonts.headings};
`

const HeaderInner = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {
    flex-direction: row;
  }
`

const HeaderNav = styled('nav')`
  flex: 1 1 auto;

  margin-top: -5px;

  margin-right: 10px;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display:none;
  }
`

const HeaderNavLink = styled(NavLink)`
  margin: 0 4rem;

  font-size: 20px;

  font-weight: 600;

  &.is-active {
    color: #ffcc00;
    text-shadow: 0px 1px 5px rgb(255 204 0 / 50%);
  }
`

const Title = styled('div')`
  font-weight: 600;
  font-size: 28px;
  vertical-align: middle;
  line-height: normal;
  display: inline-block;
  margin-bottom: 12px;
`

const Balance = styled('div')`
  margin-right: 40px;
  border: 1px solid #fccc75;
  padding-top: 4px;
  padding-bottom: 4px;
  padding-right: 40px;
  padding-left: 20px;
  border-radius: 1.5em;
  position: relative;
  display: block;
  vertical-align: middle;
  color: #06c270;
  font-weight: 700;
  font-size: 20px;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display:none;
  }
`
const BalanceNum = styled('span')`
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
  margin-bottom: 9px;
  margin-left: 15px;
`

const BalanceImg = styled('div')`
  margin-top: 7px;
  display: inline-block;
`

const UserId = styled('div')`
  position: relative;
  display: inline-block;
  vertical-align: middle;
  box-shadow: 60px 24px 40px rgba(0, 0, 0, 0.4);
  padding-right: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 12px;
  margin-left: 5px;
  margin-right: 20px;

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    display:none;
  }
`

const FaBar = styled('div')`
  display: none;
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    float: right;
    display: block;
    position: absolute;
    right: 0;
    top: 0;
  }
`

const Logo = () => (
  <svg width="80" height="104" viewBox="0 0 90 104" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d)">
      <path
        d="M43.8216 56.4767C44.3961 56.1776 45.0797 56.1753 45.6562 56.4703L72.5213 70.2196C73.973 70.9626 73.973 73.0374 72.5213 73.7804L45.6562 87.5297C45.0797 87.8247 44.3961 87.8224 43.8216 87.5233L17.4081 73.774C15.9727 73.0269 15.9727 70.9731 17.4081 70.226L43.8216 56.4767Z"
        fill="black"
        fill-opacity="0.01"
      />
    </g>
    <path
      d="M13.3334 24.4322C13.3334 20.8638 15.2348 17.5658 18.323 15.7779L39.9897 3.23407C43.0889 1.43975 46.9111 1.43975 50.0104 3.23406L71.6771 15.7779C74.7652 17.5658 76.6667 20.8638 76.6667 24.4322V49.5678C76.6667 53.1362 74.7652 56.4342 71.6771 58.2221L50.0104 70.7659C46.9111 72.5602 43.089 72.5602 39.9897 70.7659L18.323 58.2221C15.2348 56.4342 13.3334 53.1362 13.3334 49.5678V24.4322Z"
      fill="url(#paint0_radial)"
    />
    <g clip-path="url(#clip0)">
      <path
        d="M73.9854 28.8112C73.2964 29.9115 72.4462 30.7184 71.376 31.3346C64.4566 35.3251 57.5519 39.3304 50.6325 43.3209C48.7854 44.3772 47.8912 45.9177 47.8912 48.0596C47.9205 53.7814 47.8912 59.5031 47.9058 65.2248C47.9058 65.797 47.642 66.5452 48.331 66.8973C48.976 67.2347 49.5477 66.7506 50.0901 66.4425C57.1708 62.3493 64.2514 58.2414 71.3467 54.1628C73.1352 53.1358 74.0001 51.6981 73.9854 49.6295C73.9561 42.9248 73.9708 36.2348 73.9708 29.5301C73.9854 29.2807 73.9854 29.0459 73.9854 28.8112Z"
        fill="#F9F9FA"
      />
      <path
        d="M45.9701 41.9722C45.9701 41.5907 45.9701 41.4147 45.9701 41.2533C45.9701 29.7658 45.9701 18.2784 45.9701 6.7909C45.9701 6.54149 45.9701 6.29208 45.9261 6.05734C45.7648 5.23576 45.1784 4.86898 44.3575 5.04504C44.0203 5.11839 43.7271 5.27978 43.4193 5.45583C39.5052 7.71517 35.591 9.97452 31.6915 12.2485C27.9533 14.4052 24.2004 16.5618 20.4622 18.7332C17.2371 20.6111 17.1638 24.6163 20.3303 26.4648C27.4109 30.5727 34.5062 34.6366 41.5722 38.7592C43.0821 39.6395 44.7973 40.2556 45.9701 41.9722Z"
        fill="#F9F9FA"
      />
      <path
        d="M21.826 42.69C22.1192 47.7222 26.5025 53.5613 32.6742 53.8694C35.5915 54.0161 37.9224 52.549 38.9339 49.8495C39.1098 49.3947 39.1391 48.9399 39.0658 48.4851C38.9339 47.6635 38.2302 46.9593 37.4679 46.8859C36.647 46.7979 36.4564 46.9886 35.9873 48.045C35.2836 49.6148 34.0815 50.5097 32.3517 50.5537C28.804 50.6564 25.1831 47.2967 24.9925 43.717C24.9485 42.9101 24.8166 42.1472 24.1716 41.6044C23.6731 41.1789 23.0868 40.9882 22.471 41.2522C21.8553 41.5163 21.7967 42.1032 21.826 42.69Z"
        fill="#F9F9FA"
      />
      <path
        d="M35.4303 42.3672C35.4303 43.4676 36.2952 44.3918 37.3361 44.3772C38.0104 44.3625 38.4649 43.9077 38.4649 43.2035C38.4795 42.1765 37.4387 41.0615 36.5151 41.0762C35.8261 41.0909 35.4303 41.575 35.4303 42.3672Z"
        fill="#F9F9FA"
      />
    </g>
    <defs>
      <filter
        id="filter0_d"
        x="0.331543"
        y="40.2507"
        width="89.2786"
        height="63.4986"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
        <feOffset />
        <feGaussianBlur stdDeviation="8" />
        <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.8 0 0 0 0 0 0 0 0 0.4 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
      </filter>
      <radialGradient
        id="paint0_radial"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(69.4999 11.9999) rotate(133.603) scale(28.9994 59.7155)"
      >
        <stop stop-color="#FFDB00" />
        <stop offset="1" stop-color="#FFB800" />
      </radialGradient>
      <clipPath id="clip0">
        <rect width="56" height="62" fill="white" transform="translate(18 5)" />
      </clipPath>
    </defs>
  </svg>
)

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

const FaBarIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
)

function Header() {
  const [isDropMenu, setDropMenu] = useState(false);
  const handleDropMenuClick = () => {
    setDropMenu(isDropMenu => !isDropMenu);
  }

  return (
    <Wrapper>
      <HeaderInner>
        <Logo />
        <Title>GORIANT</Title>
        <HeaderNav>
          <HeaderNavLink exact to="/pool" activeClassName="is-active">
            POOL
        </HeaderNavLink>
          <HeaderNavLink to="/voting" activeClassName="is-active">
            VOTING
        </HeaderNavLink>
        </HeaderNav>
        <Balance>
          <BalanceImg>
            <Coin />
          </BalanceImg>
          <BalanceNum>$323.31</BalanceNum>
        </Balance>
        <div className="userInfo">
          <UserId style={{ paddingRight: 30 }}>
            <ConnectStatus />
          </UserId>
        </div>
        <FaBar onClick={handleDropMenuClick}>
          <FaBarIcon></FaBarIcon>
          {isDropMenu && (
            <Menu
              mode="inline"
              theme="dark"
            >
              <Menu.Item key="1">
                <Link to="/pool"></Link>Pool
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/voting"></Link>Vote
              </Menu.Item>
              <Menu.Item key="3">
                Connect Wallet
              </Menu.Item>
            </Menu>
          )}
        </FaBar>
      </HeaderInner>
    </Wrapper>
  );
}

export default Header
