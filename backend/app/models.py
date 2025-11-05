from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=True)
    google_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)

    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    plaid_accounts = relationship("PlaidAccount", back_populates="user", cascade="all, delete-orphan")
    ai_insights = relationship("AIInsight", back_populates="user", cascade="all, delete-orphan")


class Goal (Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    goal_type = Column(String, nullable=False)
    target_amount = Column(Float, nullable=False)
    deadline = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="goals")


class Transaction (Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    plaid_transaction_id = Column(String, nullable=False, index=True, unique=True)
    date = Column(Date, nullable=False)
    amount = Column(Float, nullable=False)
    merchant_name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    account_id = Column(Integer, ForeignKey("plaid_accounts.id", ondelete="CASCADE"))

    user = relationship("User", back_populates="transactions")
    account = relationship("PlaidAccount", back_populates="transactions")


class PlaidAccount (Base):
    __tablename__ = "plaid_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    plaid_access_token = Column(String, nullable=False)
    plaid_item_id = Column(String, nullable=False, unique=True)
    institution_name = Column(String, nullable=False)
    linked_at = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="plaid_accounts")
    transactions = relationship("Transaction", back_populates="account", cascade="all, delete-orphan")


class AIInsight (Base):
    __tablename__ = "ai_insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    analysis_text = Column(Text, nullable=False)
    generated_at = Column(DateTime, default=datetime.now)

    user = relationship("User", back_populates="ai_insights")
