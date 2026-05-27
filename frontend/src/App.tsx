import {
  BarChartOutlined,
  DatabaseOutlined,
  HistoryOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Badge, Button, Layout, Menu, Space, Typography } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  fetchInsight,
  fetchInsights,
  fetchOverview,
  fetchRuns,
  fetchTrends,
  InsightDetail,
  InsightPage,
  Overview,
  RunLog,
  Trends,
} from "./api";
import { Dashboard } from "./pages/Dashboard";
import { AgentSettings } from "./pages/AgentSettings";
import { InsightDetailView } from "./pages/InsightDetailView";
import { InsightLibrary } from "./pages/InsightLibrary";
import { RunLogs } from "./pages/RunLogs";
import { Filters } from "./types";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

function App() {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [overview, setOverview] = useState<Overview | null>(null);
  const [trends, setTrends] = useState<Trends | null>(null);
  const [runs, setRuns] = useState<RunLog[]>([]);
  const [insights, setInsights] = useState<InsightPage>({
    items: [],
    total: 0,
    page: 1,
    page_size: 20,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 1,
    page_size: 20,
    sort_by: "score",
  });
  const [selected, setSelected] = useState<InsightDetail | null>(null);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [overviewData, trendsData, runsData, insightData] =
        await Promise.all([
          fetchOverview(),
          fetchTrends(),
          fetchRuns(),
          fetchInsights(filters),
        ]);
      setOverview(overviewData);
      setTrends(trendsData);
      setRuns(runsData);
      setInsights(insightData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [filters]);

  const latestRun = overview?.latest_run;
  const languageData = useMemo(() => {
    const totals = new Map<string, number>();
    trends?.languages.forEach((item) => {
      totals.set(item.language, (totals.get(item.language) || 0) + item.count);
    });
    return Array.from(totals.entries()).map(([language, count]) => ({
      language,
      count,
    }));
  }, [trends]);

  const openInsight = async (id: number) => {
    setSelected(await fetchInsight(id));
  };

  return (
    <Layout className="app-shell">
      <Sider width={232} className="sidebar">
        <div className="brand">
          <div className="brand-mark">GI</div>
          <div>
            <strong>GitHub Insight</strong>
            <span>Agent Console</span>
          </div>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[activeKey]}
          onClick={(item) => setActiveKey(item.key)}
          items={[
            { key: "dashboard", icon: <BarChartOutlined />, label: "Dashboard" },
            { key: "insights", icon: <DatabaseOutlined />, label: "Insight Library" },
            { key: "runs", icon: <HistoryOutlined />, label: "Run Logs" },
            { key: "settings", icon: <SettingOutlined />, label: "Agent Settings" },
          ]}
        />
      </Sider>
      <Layout>
        <Header className="topbar">
          <div>
            <Title level={4}>开源洞察数据看板</Title>
            <Text type="secondary">
              由 GitHub Actions 每日定时生成，前端只读展示 SQLite 结果
            </Text>
          </div>
          <Space>
            <Badge
              status={
                latestRun?.status === "success"
                  ? "success"
                  : latestRun?.status === "failed"
                    ? "error"
                    : "processing"
              }
            />
            <Text>
              {latestRun
                ? `最近运行：${dayjs(latestRun.started_at).format("YYYY-MM-DD HH:mm")}`
                : "暂无运行记录"}
            </Text>
            <Button onClick={loadAll}>刷新数据</Button>
          </Space>
        </Header>
        <Content className="content">
          {selected ? (
            <InsightDetailView insight={selected} onBack={() => setSelected(null)} />
          ) : (
            <>
              {activeKey === "dashboard" && (
                <Dashboard
                  overview={overview}
                  trends={trends}
                  languageData={languageData}
                  insights={insights.items}
                  loading={loading}
                  onOpen={openInsight}
                />
              )}
              {activeKey === "insights" && (
                <InsightLibrary
                  data={insights}
                  loading={loading}
                  filters={filters}
                  setFilters={setFilters}
                  onOpen={openInsight}
                  onChanged={loadAll}
                />
              )}
              {activeKey === "runs" && <RunLogs runs={runs} loading={loading} />}
              {activeKey === "settings" && <AgentSettings />}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
