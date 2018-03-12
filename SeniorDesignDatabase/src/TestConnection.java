import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestConnection {
	public static void main(String[] args) {
		String url = "jdbc:mysql://localhost:3306/javabase";
		String username = "java";
		String password = "password";
		
		System.out.println("Connecting database...");
		
		try(Connection connection = DriverManager.getConnection(url, username, password)) {
			System.out.println("Database connected");
			connection.close();
		}
		catch(SQLException e) {
			throw new IllegalStateException("Cannot connect the database", e);
		}
	}
}
