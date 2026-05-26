import { FireOutlined, StarFilled } from "@ant-design/icons";
import {
  Card,
  Col,
  Empty,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Insight, Overview, Trends } from "../api";
import { Metric } from "../components/Metric";
import { LanguageDatum } from "../types";

const { Title, Text, Paragraph } = Typography;

type DashboardProps = {
  overview: Overview | null;
  trends: Trends | null;
  languageData: LanguageDatum[];
  insights: Insight[];
  loading: boolean;
  onOpen: (id: number) => void;
};

export function Dashboard({
  overview,
  trends,
  languageData,
  insights,
  loading,
  onOpen,
}: DashboardProps) {
  return (
    <Space direction="vertical" size={24} className="full-width">
      <Row gutter={16}>
        <Metric title="收录项目" value={overview?.total_projects || 0} />
        <Metric title="今日新增" value={overview?.today_new || 0} />
        <Metric title="今日更新" value={overview?.today_updated || 0} />
        <Metric title="平均评分" value={overview?.average_score || 0} suffix="/ 5" />
        <Metric title="缓存命中" value={overview?.cache_hit_count || 0} />
      </Row>

      <section>
        <Title level={4} style={{ marginTop: 8, marginBottom: 16, color: "#101828" }}>
          今日焦点：高分开源项目推荐
        </Title>
        {insights.length ? (
          <Row gutter={[24, 24]}>
            {insights.slice(0, 3).map((item) => (
              <Col xs={24} lg={8} key={item.id}>
                <Card
                  hoverable
                  onClick={() => onOpen(item.id)}
                  className="insight-list-card"
                  style={{
                    borderRadius: 12,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #e2e8f0",
                  }}
                  bodyStyle={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    padding: 20,
                  }}
                >
                  <div className="card-title-row">
                    <Title level={5} style={{ margin: 0, color: "#1d4ed8" }} ellipsis>
                      {item.project_name}
                    </Title>
                    <Tag icon={<StarFilled />} color="gold" style={{ margin: 0 }}>
                      {item.score}
                    </Tag>
                  </div>

                  <Space wrap>
                    <Tag color="cyan">{item.language}</Tag>
                    <Tag color="default">★ {item.stars}</Tag>
                  </Space>

                  <Paragraph ellipsis={{ rows: 2 }} className="muted-summary">
                    {item.summary || "暂无摘要内容..."}
                  </Paragraph>

                  <div className="business-box">
                    <Text strong className="business-title">
                      商业潜力：
                    </Text>
                    <Paragraph ellipsis={{ rows: 2 }} className="business-text">
                      {item.business_potential || "未分析"}
                    </Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Card style={{ borderRadius: 12 }}>
            <Empty description="暂无焦点项目" />
          </Card>
        )}
      </section>

      <section style={{ marginTop: 16 }}>
        <Title level={5} style={{ marginBottom: 16, color: "#64748b" }}>
          趋势与数据概览
        </Title>
        <Row gutter={16}>
          <Col span={14}>
            <Card title="近 30 天新增/更新趋势" loading={loading} style={{ borderRadius: 12 }}>
              {trends?.daily.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={trends.daily}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                    <Line type="monotone" dataKey="new_count" name="新增" stroke="#2563eb" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="updated_count" name="更新" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Empty />
              )}
            </Card>
          </Col>
          <Col span={10}>
            <Card title="语言分布" loading={loading} style={{ borderRadius: 12 }}>
              {languageData.length ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={languageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="language" axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: "#64748b" }} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f1f5f9" }} />
                    <Bar dataKey="count" name="项目数" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty />
              )}
            </Card>
          </Col>
        </Row>
      </section>
    </Space>
  );
}

const tooltipStyle = {
  borderRadius: 8,
  border: "none",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
};
