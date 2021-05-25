import * as React from 'react'
import styled from '../../utils/styled'
import Container from './Container'
import { Row, Col } from 'antd'

const Wrapper = styled('footer')`
  padding: 0.5rem 1.5rem;
  left: 0px;
  right: 0px;
  bottom: 0;

  /* Dark / Dark 1 */

  background: #28293d;
`

const FooterLeft = styled('div')`
  font-family: Inter;
  font-size: 12px;
  padding-top: 1em;

  line-height: 15px;
  /* identical to box height */
  color: #8f90a6;
`

const FooterRight = styled('div')`
  margin-left: auto;
  text-align: right;
  @media (min-width: ${props => props.theme.breakpoints.xs}) {
    padding-top: 1em;
    text-align: left;

  }
`

const Icon = styled('a')`
  font-size: 13px
  float: left;
  margin-top: -15px;

  padding-right: 1em;
`



const Footer = () => (
  <Wrapper>
      <Row>
        <Col xs={24} sm={12}>
          <FooterLeft>
            <span>© 2021 - All Rights Reserved</span>
          </FooterLeft>
        </Col>
        <Col xs={24} sm={12}>
          <FooterRight>
            <Icon href="#">
              <img src="img/Dribbble.png" />
            </Icon>
            <Icon href="#">
              <img src="img/Behance.png" />
            </Icon>
            <Icon href="#">
              <img src="img/Twitter.png" />
            </Icon>
            <Icon href="#">
              <img src="img/Instagram.png" />
            </Icon>
            <Icon href="#">
              <img src="img/Facebook.png" />
            </Icon>
            <Icon href="#">
              <img src="img/Yutube.png" />
            </Icon>
          </FooterRight>
        </Col>
      </Row>
  </Wrapper>
)
export default Footer
