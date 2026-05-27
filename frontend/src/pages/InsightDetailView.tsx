import {
  BulbOutlined,
  FireOutlined,
  GithubOutlined,
  LeftOutlined,
  StarFilled,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Divider,
  List,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import { InsightDetail } from "../api";

const { Title, Text, Paragraph } = Typography;

type InsightDetailViewProps = {
  insight: InsightDetail;
  onBack: () => void;
};

export function InsightDetailView({ insight, onBack }: InsightDetailViewProps) {
  return (
    <Card bordered={false} className="detail-page-card" bodyStyle={{ padding: "32px 40px" }}>
      <div style={{ marginBottom: 24 }}>
        <Button type="link" icon={<LeftOutlined />} onClick={onBack} style={{ padding: 0, marginBottom: 16 }}>
          返回概览
        </Button>
        <div className="detail-title-row">
          <Space align="center" size="middle" wrap>
            <Title level={2} style={{ margin: 0, color: "#0f172a" }}>
              <span style={{ color: "#3b82f6", marginRight: 8 }}>#</span>
              {insight.project_name}
            </Title>
            {insight.is_new && <Tag color="green">新收录</Tag>}
            {insight.is_updated && <Tag color="orange">信息更新</Tag>}
            <Tag icon={<StarFilled />} color="gold" className="detail-score-tag">
              评分 {insight.score}
            </Tag>
          </Space>
          <Button type="primary" icon={<GithubOutlined />} href={insight.repository_url} target="_blank" size="large" style={{ borderRadius: 8 }}>
            浏览项目 GitHub
          </Button>
        </div>
        <Space wrap style={{ marginTop: 16 }} size="large">
          <Text strong style={{ color: "#eab308", fontSize: 16 }}>
            <StarFilled /> {insight.stars} Stars
          </Text>
          <Tag color="cyan" style={{ fontSize: 14, padding: "2px 8px" }}>
            {insight.language}
          </Tag>
          <Text type="secondary" style={{ fontSize: 15 }}>
            技术栈：{insight.tech_stack?.join(", ")}
          </Text>
          <Text type="secondary" style={{ fontSize: 15 }}>
            分类：{insight.category}
          </Text>
        </Space>
      </div>

      <Divider />

      <Row gutter={[40, 40]}>
        <Col xs={24} lg={16}>
          <AnalysisContent insight={insight} />
        </Col>
        <Col xs={24} lg={8}>
          <SidePanel insight={insight} />
        </Col>
      </Row>
    </Card>
  );
}

function AnalysisContent({ insight }: { insight: InsightDetail }) {
  return (
    <>
      <section style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: "#1e293b", marginBottom: 16 }}>
          项目简介
        </Title>
        <Paragraph className="detail-summary">{insight.summary}</Paragraph>
      </section>

      <section style={{ marginBottom: 32 }}>
        <Title level={4} style={{ color: "#1e293b", marginBottom: 16 }}>
          项目详细信息
        </Title>
        <div className="detail-lines">
          {insight.details
            ?.split("\n")
            .filter((line) => line.trim())
            .map((line, index) => (
              <div key={index} className="detail-line">
                <span style={{ color: "#3b82f6", marginRight: 12 }}>-</span>
                <span>{line}</span>
              </div>
            ))}
        </div>
      </section>

      <Alert
        message={<Text strong style={{ fontSize: 16, color: "#b45309" }}>商业潜力分析</Text>}
        description={<Text className="business-alert-text">{insight.business_potential}</Text>}
        type="warning"
        icon={<FireOutlined style={{ color: "#ea580c", fontSize: 20 }} />}
        showIcon
        className="business-alert"
      />
    </>
  );
}

function SidePanel({ insight }: { insight: InsightDetail }) {
  return (
    <>
      <Card title={<Space><BulbOutlined style={{ color: "#eab308" }} />衍生灵感</Space>} className="side-card">
        <List
          dataSource={insight.dev_ideas}
          renderItem={(item, index) => (
            <List.Item className="side-list-item">
              <Text style={{ color: "#475569", fontSize: 14 }}>
                <Text strong style={{ color: "#2563eb" }}>灵感 {index + 1}: </Text>
                {item}
              </Text>
            </List.Item>
          )}
        />
      </Card>

      <Card title={<Space><ThunderboltOutlined style={{ color: "#ef4444" }} />风险提示</Space>} className="side-card">
        <List
          dataSource={insight.risk_notes}
          renderItem={(item) => (
            <List.Item style={{ padding: "8px 0", color: "#64748b", border: "none" }}>
              - {item}
            </List.Item>
          )}
        />
      </Card>

      <Card title="健康度指标" size="small" className="health-card">
        <Space direction="vertical" style={{ width: "100%", gap: 16 }}>
          <HealthItem title="活跃度" value={insight.activity_level} className="health-blue" />
          <HealthItem title="社区健康" value={insight.community_health} className="health-green" />
          <div className="date-row">
            <Text type="secondary" style={{ fontSize: 13 }}>收录日期</Text>
            <Text strong style={{ color: "#475569" }}>{insight.insight_date}</Text>
          </div>
        </Space>
      </Card>
    </>
  );
}

function HealthItem({ title, value, className }: { title: string; value: string; className: string }) {
  return (
    <div>
      <Text type="secondary" style={{ display: "block", marginBottom: 6, fontSize: 13 }}>
        {title}
      </Text>
      <div className={className}>{value}</div>
    </div>
  );
}
