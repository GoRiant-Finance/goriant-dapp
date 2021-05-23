import * as React from 'react'
import styled from '../../utils/styled'
import Container from './Container'

const Wrapper = styled('footer')`
padding: 1.5rem 1.5rem;
position: fixed;
height: 62px;
left: 0px;
right: 0px;
bottom: 0;

/* Dark / Dark 1 */

background: #28293D;
`

const FooterLeft = styled('div')`
font-family: Inter;
font-size: 12px;
line-height: 15px;
/* identical to box height */
color: #8F90A6;
`

const FooterRight = styled('div')`
margin-left: auto;
`

const Icon = styled('a')`
  font-size: 13px
  float: left;
  margin-top: -15px;
  padding-left: 1em;
`

const FooterInner = styled(Container)`
display: flex;
  
`

const Footer = () => (
    <Wrapper>
        <FooterInner>
            <FooterLeft>
                <span>© 2021 - All Rights Reserved</span>
            </FooterLeft>
            <FooterRight>
                <Icon href='#'><img src="img/Dribbble.png" /></Icon>
                <Icon href='#'><img src="img/Behance.png" /></Icon>
                <Icon href='#'><img src="img/Twitter.png" /></Icon>
                <Icon href='#'><img src="img/Instagram.png" /></Icon>
                <Icon href='#'><img src="img/Facebook.png" /></Icon>
                <Icon href='#'><img src="img/Yutube.png" /></Icon>
            </FooterRight>
        </FooterInner>
    </Wrapper>
)
export default Footer