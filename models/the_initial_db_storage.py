import os
import sqlalchemy
from sqlalchemy.orm import scoped_session, sessionmaker
from models.base_model import Base
from models.amenity import Amenity
from models.city import City
from models.place import Place
from models.review import Review
from models.state import State
from models.user import User

classes = {"Amenity": Amenity, "City": City,
           "Place": Place, "Review": Review, "State": State, "User": User}


class DBStorage:
    """Interacts with the PostgreSQL database provided by Heroku"""

    __engine = None
    __session = None

    def __init__(self):
        """Instantiate a DBStorage object"""

        # Get the DATABASE_URL from the environment variables
        #db_url = os.getenv('DATABASE_URL')
        db_url = os.getenv('postgres://vqqsnkqmflwapa:ecb0af2318cab18ab980870fffed4449b0b245019a1d91a066e0d7b8cae4d7b3@ec2-44-206-204-65.compute-1.amazonaws.com:5432/d3r12mcpffjjn4')
        if not db_url:
            raise ValueError("DATABASE_URL environment variable is not set")

        # Create the SQLAlchemy engine
        self.__engine = sqlalchemy.create_engine(db_url)

        # Create all tables in the database
        Base.metadata.create_all(self.__engine)

        # Create a session factory
        session_factory = sessionmaker(bind=self.__engine)
        Session = scoped_session(session_factory)
        self.__session = Session()

    def all(self, cls=None):
        """Query on the current database session"""
        new_dict = {}
        for cls_name, cls_obj in classes.items():
            if cls is None or cls is cls_obj or cls is cls_name:
                objs = self.__session.query(cls_obj).all()
                for obj in objs:
                    key = "{}.{}".format(cls_name, obj.id)
                    new_dict[key] = obj
        return new_dict

    def new(self, obj):
        """Add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """Commit all changes of the current database session"""
        self.__session.commit()

    def delete(self, obj=None):
        """Delete from the current database session obj if not None"""
        if obj:
            self.__session.delete(obj)

    def reload(self):
        """Reloads data from the database"""
        self.__session.close()
        self.__session = scoped_session(sessionmaker(bind=self.__engine))
        Base.metadata.create_all(self.__engine)

    def close(self):
        """Call remove() method on the private session attribute"""
        self.__session.remove()

    def get(self, cls, id):
        """
        Returns the object based on the class name and its ID, or
        None if not found
        """
        if cls in classes.values():
            all_objs = self.all(cls)
            for obj in all_objs.values():
                if obj.id == id:
                    return obj
        return None

    def count(self, cls=None):
        """
        Count the number of objects in storage
        """
        if cls:
            return len(self.all(cls))
        return sum(len(self.all(cls)) for cls in classes.values())
