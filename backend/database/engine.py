from collections.abc import Generator

from sqlalchemy import inspect, text
from sqlmodel import Session, SQLModel, create_engine

from backend.core.config import get_settings


settings = get_settings()
engine = create_engine(settings.database_url, echo=False)


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    _ensure_analysis_report_columns()


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def _ensure_analysis_report_columns() -> None:
    inspector = inspect(engine)
    if not inspector.has_table("analysisreport"):
        return

    existing_columns = {
        column["name"] for column in inspector.get_columns("analysisreport")
    }
    migrations = {
        "business_potential": "ALTER TABLE analysisreport ADD COLUMN business_potential VARCHAR DEFAULT '文档未提及'",
        "community_health": "ALTER TABLE analysisreport ADD COLUMN community_health VARCHAR DEFAULT '未知'",
        "activity_level": "ALTER TABLE analysisreport ADD COLUMN activity_level VARCHAR DEFAULT '未知'",
        "risk_notes": "ALTER TABLE analysisreport ADD COLUMN risk_notes JSON DEFAULT '[]'",
        "metrics": "ALTER TABLE analysisreport ADD COLUMN metrics JSON DEFAULT '{}'",
    }

    with engine.begin() as connection:
        for column_name, sql in migrations.items():
            if column_name not in existing_columns:
                connection.execute(text(sql))
