from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional
import enum
from datetime import datetime

db = SQLAlchemy()


class Type_Stat(enum.Enum):
    BODY = 1
    MIND = 2
    PRODUCTIVITY = 3
    CREATIVITY = 4
    SOCIAL = 5


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(280), nullable=False, unique=True)
    age: Mapped[int] = mapped_column(nullable=True)
    country_city: Mapped[str] = mapped_column(String(280), nullable=True)
    level: Mapped[int] = mapped_column(default=0)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=True)

    # ---------------------------- stats
    body: Mapped[int] = mapped_column(default=0)
    mind: Mapped[int] = mapped_column(default=0)
    productivity: Mapped[int] = mapped_column(default=0)
    creativity: Mapped[int] = mapped_column(default=0)
    social: Mapped[int] = mapped_column(default=0)

    # ---------------------------- relationships
    task_list: Mapped[List["Task"]] = relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "age": self.age,
            "country_city": self.country_city,
            "level": self.level,
            "body": self.body,
            "mind": self.mind,
            "productivity": self.productivity,
            "creativity": self.creativity,
            "social": self.social
        }


class Task(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    description: Mapped[str] = mapped_column(String(300), nullable=False)
    duration: Mapped[Optional[int]] = mapped_column(nullable=True)
    time_to_start: Mapped[Optional[str]] = mapped_column(
        String(300), nullable=True)
    recovery_time: Mapped[datetime] = mapped_column(nullable=True)
    difficulty: Mapped[int] = mapped_column(nullable=False)
    habit: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean(), nullable=False)

    # -------------------------------- stats
    body: Mapped[int] = mapped_column(nullable=True)
    mind: Mapped[int] = mapped_column(nullable=True)
    productivity: Mapped[int] = mapped_column(nullable=True)
    creativity: Mapped[int] = mapped_column(nullable=True)
    social: Mapped[int] = mapped_column(nullable=True)

    # -------------------------------- relationships
    user: Mapped["User"] = relationship(back_populates="task_list")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "description": self.description,
            "duration": self.duration,
            "time_to_start": self.time_to_start,
            "habit": self.habit,
            "done": self.done,
            "recovery_time": self.recovery_time,
            "difficulty": self.difficulty,
            "body": self.body,
            "mind": self.mind,
            "productivity": self.productivity,
            "creativity": self.creativity,
            "social": self.social
        }
