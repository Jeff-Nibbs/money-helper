from database import Base
from sqlalchemy import String, Integer, Column, ForeignKey, Boolean


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False, unique=True)
    first_name = Column(String, default='Todd')
    last_name = Column(String, default='Dangerfell')
    email= Column(String, unique=True, nullable=False)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

class Account(Base):
    __tablename__ = 'accounts'

    id = Column(Integer, primary_key=True, index=True)
    official_name = Column(String)
    type = Column(String)
    balance = Column(Integer)
    subtype = Column(String)
    owner_id = Column(Integer, ForeignKey('users.id'))

