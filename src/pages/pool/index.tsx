import * as React from 'react'
import { Space, Card } from 'antd'

import Page from '../../components/layout/Page'
import Container from '../../components/layout/Container'
import styled from '../../utils/styled'
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
                    <p>Card content</p>
                    <p>Card content</p>
                  </Card>
                </Col>
                <Col span={24}>
                  <Card bordered={false} style={{ background: dark1, borderRadius: 16 }}>
                    <p>Card content</p>
                    <p>Card content</p>
                  </Card>{' '}
                </Col>
              </Row>{' '}
            </Col>

            <Col xs={24} sm={14}>
              <Card bordered={false} style={{ background: dark1, borderRadius: 16, height: '100%' }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>{' '}
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={24} style={{ marginBottom: 20 }}>
              <Card
                style={{
                  border: '2px solid transparent',
                  background: 'linear-gradient(#28293D,#28293D) padding-box, linear-gradient(to right, #00CFDE, #05A660) border-box',
                  borderRadius: 16,
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
                  borderRadius: 16,
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
    font-family: ${props => props.theme.fonts.headings};
    line-height: 1.25;
  }
`
