import * as React from 'react'
import { NavLink } from 'react-router-dom'
import styled from '../../utils/styled'
import Container from './Container'

interface HeaderProps {
  title: string
}

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

const HeaderLeft = styled('div')`
  padding-right: 1rem;
`

const Logo = styled('img')`
  width: 25%;
  height: auto;
  margin-top: auto;
  margin-bottom: -10px;
`

const HeaderNav = styled('nav')`
  flex: 1 1 auto;

  margin-top: -5px;

  margin-right: 10px;

  @media (min-width: ${props => props.theme.breakpoints.lg}) {

  }
`

const HeaderNavLink = styled(NavLink)`
  margin: 0 4rem;

  font-size: 22px;

  font-weight: 600;

  &.is-active {
    color: #FFCC00; 
    text-shadow: 0px 1px 5px rgb(255 204 0 / 50%);
  }
`

const Title = styled('div')`
  margin: 0;
  font-weight: 700;
  font-size: 30px;
  display: inline;
`

const Balance = styled('div')`
  border: 1px solid #FCCC75;
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 40px;
  padding-left: 20px;
  border-radius: 1.5em;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  color: #06C270;
  font-weight: 700;
  font-size: 22px;
`
const BalanceImg = styled('img')`
  margin-top: 5px;
`

const UserId = styled('div')`
  position: relative;
  display: inline-block;
  margin: 4%;
  vertical-align: middle;
  box-shadow: 60px 24px 40px rgba(0, 0, 0, 0.4); 
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 80px;
  font-size: 12px;
`

const Header: React.FC<HeaderProps> = ({ title }) => (
  <Wrapper>
    <HeaderInner>
      <HeaderLeft>
        <Logo src="img/Yellow.png" alt="goriant logo"/>
        <Title>{title}</Title>
      </HeaderLeft>
      <HeaderNav>
        <HeaderNavLink exact to="/" activeClassName="is-active">
          POOL
        </HeaderNavLink>
        <HeaderNavLink to="/heroes" activeClassName="is-active">
          VOTING
        </HeaderNavLink>
      </HeaderNav>
    <Balance>
        <BalanceImg src="img/Coin.png"/>
        <span>$323.31</span>
      </Balance>
      <UserId>
      <img src="img/Core Icon.png"/><span>USERID: 03TGD5DGDAHAIA</span>
      </UserId>
    </HeaderInner>
  </Wrapper>
)

export default Header
