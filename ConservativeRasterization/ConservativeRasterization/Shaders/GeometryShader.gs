#version 450 core
layout(triangles) in;

// Conservative and "normal" rasterized triangle are created.
layout(triangle_strip, max_vertices = 6) out;

uniform mat4 u_projectionMatrix;
uniform mat4 u_viewMatrix;

uniform vec2 u_halfPixelSize;

out vec2 v_pos;
out vec4 v_aabb;

out vec4 v_color;

void main(void)
{
    int i;
    
    vec4 vertex[3];
    
    vec2 pos[3];

    vec4 aabb = vec4(1.0, 1.0, -1.0, -1.0);

    for (i = 0; i < gl_in.length(); i++)
    {
		vertex[i] = u_projectionMatrix * u_viewMatrix * gl_in[i].gl_Position;
		
		pos[i] = vertex[i].xy / vertex[i].w;  

		aabb.xy = min(aabb.xy, pos[i].xy);

		aabb.zw = max(aabb.zw, pos[i].xy);
    }
        
   
    
    vec4 aabbConservative = aabb + vec4(-u_halfPixelSize, u_halfPixelSize);

	
    
	vec3 plane[3];

    for (i = 0; i < gl_in.length(); i++)
    {

		plane[i] = cross(vertex[i].xyw, vertex[(i + 2) % 3].xyw);
		plane[i].z -= dot(u_halfPixelSize, abs(plane[i].xy));
    }
    
    
    vec3 intersect;
        
    for (i = 0; i < gl_in.length(); i++)
    {
    
    	intersect = cross(plane[i], plane[(i+1) % 3]);
 
    	gl_Position.xyw = intersect;
		
		v_pos = intersect.xy / intersect.z;
		v_aabb = aabbConservative;
		
		v_color = vec4(1.0, 0.0, 0.0, 1.0);

        EmitVertex();
    }
    
    EndPrimitive();
    
    
    for (i = 0; i < gl_in.length(); i++)
    {
    	gl_Position = vertex[i];
		
		v_pos = pos[i];
		v_aabb = aabb;
		
		v_color = vec4(0.0, 0.0, 1.0, 1.0);

        EmitVertex();
    }
 
    EndPrimitive();            


}